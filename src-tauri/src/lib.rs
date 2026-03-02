mod claude_process;
mod commands;
mod config;
pub mod error;
mod events;
pub mod llm_reviewer;
pub mod response_state;
mod streaming;
pub mod timeouts;
pub mod warmup;

use commands::{cmd_debug_log, AppState};
use tauri::Manager;
use tauri_plugin_cli::CliExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build());

    #[cfg(debug_assertions)]
    {
        builder = builder.plugin(tauri_plugin_webdriver::init());
    }

    builder.setup(|app| {
            // Log raw args for diagnostics
            cmd_debug_log("SETUP", &format!("Raw args: {:?}", std::env::args().collect::<Vec<_>>()));

            // Parse CLI arguments (with diagnostic logging instead of silent .ok())
            let cli_matches = match app.cli().matches() {
                Ok(matches) => {
                    cmd_debug_log("SETUP", &format!("CLI parsed OK: {:?}",
                        matches.args.keys().collect::<Vec<_>>()));
                    Some(matches)
                }
                Err(e) => {
                    cmd_debug_log("SETUP", &format!("CLI parse failed: {}", e));
                    None
                }
            };

            let cli_dir = cli_matches.as_ref().and_then(|matches| {
                matches
                    .args
                    .get("directory")
                    .and_then(|arg| arg.value.as_str().map(|s| s.to_string()))
            });

            let cli_resume = cli_matches.as_ref().and_then(|matches| {
                matches
                    .args
                    .get("resume")
                    .and_then(|arg| arg.value.as_str().map(|s| s.to_string()))
            });

            cmd_debug_log("SETUP", &format!("CLI: dir={:?}, resume={:?}", cli_dir, cli_resume));

            // Check for file-based launch intent (from recall skill or external tools).
            // This sidesteps macOS Launch Services not reliably passing CLI args to app bundles.
            let (file_dir, file_resume) = read_pending_launch();

            // File-based intent fills in any gaps left by CLI parsing
            let final_dir = cli_dir.or(file_dir);
            let final_resume = cli_resume.or(file_resume);

            cmd_debug_log("SETUP", &format!("Final: dir={:?}, resume={:?}", final_dir, final_resume));

            // Create and manage AppState with CLI directory and optional resume session
            let state = AppState::new(final_dir, final_resume);
            app.manage(state);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Session commands
            commands::session::start_session,
            commands::session::stop_session,
            commands::session::send_interrupt,
            commands::session::is_session_active,
            commands::session::get_launch_dir,
            commands::session::is_sandbox_enabled,
            commands::session::clear_session,
            commands::session::resume_session,
            // Messaging
            commands::messaging::send_message,
            // Configuration
            commands::config_cmd::get_config,
            commands::config_cmd::save_config,
            commands::config_cmd::has_local_config,
            // Permissions
            commands::permission::send_permission_response,
            commands::permission::poll_permission_request,
            commands::permission::respond_to_permission,
            commands::permission::get_session_id,
            commands::permission::send_question_response,
            commands::permission::send_question_cancel,
            commands::permission::review_permission_request,
            // Streaming command runner
            commands::streaming_cmd::run_streaming_command,
            // Session listing (for sidebar)
            commands::session_list::list_sessions,
            commands::session_list::delete_session,
            commands::session_list::get_session_history,
            // Session custom names
            commands::session_names::get_session_names,
            commands::session_names::set_session_name,
            commands::session_names::delete_session_name,
            // Appearance commands
            commands::appearance_cmd::list_color_schemes,
            commands::appearance_cmd::get_scheme_colors,
            // Directory/window commands
            commands::directory_cmd::open_new_window_with_picker,
            commands::directory_cmd::open_new_window,
            commands::directory_cmd::reopen_in_directory,
            commands::directory_cmd::has_cli_directory,
            commands::directory_cmd::get_pending_resume,
            commands::directory_cmd::check_claude_code_installed,
            // Project listing (for project picker)
            commands::project_list::list_projects,
            // Bot mode commands
            commands::bot_config::get_bot_api_key,
            commands::bot_config::has_bot_api_key,
            commands::bot_config::set_bot_api_key,
            commands::bot_config::validate_bot_api_key,
            // Window commands
            commands::window_cmd::activate_app,
        ]).run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Read and consume a pending launch intent file written by external tools (e.g. recall skill).
///
/// The file at `~/.claudia/pending-launch.json` contains:
///   { "directory": "/path/to/project", "sessionId": "uuid", "timestamp": "iso8601" }
///
/// The file is always deleted after reading (even on parse failure) to prevent stale launches.
/// Files older than 30 seconds are ignored as stale.
fn read_pending_launch() -> (Option<String>, Option<String>) {
    let path = match dirs::home_dir() {
        Some(home) => home.join(".claudia").join("pending-launch.json"),
        None => return (None, None),
    };

    if !path.exists() {
        return (None, None);
    }

    cmd_debug_log("SETUP", &format!("Found pending-launch.json at {:?}", path));

    let content = match std::fs::read_to_string(&path) {
        Ok(c) => c,
        Err(e) => {
            cmd_debug_log("SETUP", &format!("Failed to read pending-launch.json: {}", e));
            let _ = std::fs::remove_file(&path);
            return (None, None);
        }
    };

    // Always delete after reading
    let _ = std::fs::remove_file(&path);

    let json: serde_json::Value = match serde_json::from_str(&content) {
        Ok(v) => v,
        Err(e) => {
            cmd_debug_log("SETUP", &format!("Failed to parse pending-launch.json: {}", e));
            return (None, None);
        }
    };

    // Reject stale files (older than 30 seconds)
    if let Some(ts) = json.get("timestamp").and_then(|v| v.as_str()) {
        if let Ok(file_time) = chrono::DateTime::parse_from_rfc3339(ts) {
            let age = chrono::Utc::now().signed_duration_since(file_time);
            if age.num_seconds() > 30 {
                cmd_debug_log("SETUP", &format!("Ignoring stale pending-launch.json ({}s old)", age.num_seconds()));
                return (None, None);
            }
        }
    }

    let dir = json.get("directory").and_then(|v| v.as_str()).map(String::from);
    let session = json.get("sessionId").and_then(|v| v.as_str()).map(String::from);

    cmd_debug_log("SETUP", &format!("Pending launch: dir={:?}, session={:?}", dir, session));

    (dir, session)
}
