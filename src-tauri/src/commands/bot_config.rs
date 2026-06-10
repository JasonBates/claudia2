use crate::llm_reviewer::validate_api_key;
use std::fs;
use std::path::PathBuf;
use tauri::State;

use super::secure_ipc::secure_write;
use super::AppState;

/// Get the path to the .env file for the current working directory
fn get_env_path(working_dir: &str) -> PathBuf {
    PathBuf::from(working_dir).join(".env")
}

/// Read the Bot API key from .env file
/// Returns a masked version for display (e.g., "sk-ant-***...***")
#[tauri::command]
pub fn get_bot_api_key(state: State<'_, AppState>) -> Result<Option<String>, String> {
    Ok(get_raw_api_key(&state.launch_dir).map(|key| mask_api_key(&key)))
}

/// Check if a Bot API key is configured (without returning the actual key)
#[tauri::command]
pub fn has_bot_api_key(state: State<'_, AppState>) -> Result<bool, String> {
    Ok(get_raw_api_key(&state.launch_dir).is_some())
}

/// Get the raw API key (for internal use only, not exposed to frontend)
///
/// Single source of truth for .env parsing - the masked/boolean commands
/// above delegate here.
pub fn get_raw_api_key(working_dir: &str) -> Option<String> {
    let env_path = get_env_path(working_dir);
    if !env_path.exists() {
        return None;
    }

    let contents = fs::read_to_string(&env_path).ok()?;

    for line in contents.lines() {
        let line = line.trim();
        if line.starts_with("ANTHROPIC_API_KEY=") {
            let key = line.strip_prefix("ANTHROPIC_API_KEY=").unwrap_or("");
            let key = key.trim_matches('"').trim_matches('\'');
            if !key.is_empty() {
                return Some(key.to_string());
            }
        }
    }

    None
}

/// Set the Bot API key in .env file
#[tauri::command]
pub async fn set_bot_api_key(api_key: String, state: State<'_, AppState>) -> Result<(), String> {
    let env_path = get_env_path(&state.launch_dir);

    // Read existing .env file or start fresh
    let mut lines: Vec<String> = if env_path.exists() {
        fs::read_to_string(&env_path)
            .map_err(|e| format!("Failed to read .env file: {}", e))?
            .lines()
            .map(|s| s.to_string())
            .collect()
    } else {
        Vec::new()
    };

    // Find and replace or add ANTHROPIC_API_KEY
    let key_line = format!("ANTHROPIC_API_KEY={}", api_key);
    let mut found = false;
    for line in &mut lines {
        if line.trim().starts_with("ANTHROPIC_API_KEY=") {
            *line = key_line.clone();
            found = true;
            break;
        }
    }

    if !found {
        lines.push(key_line);
    }

    // Atomic write (temp file + rename, 0o600) via secure_write: a crash
    // mid-write must not corrupt a file that may hold other secrets.
    let contents = lines.join("\n") + "\n";
    secure_write(&env_path, &contents)
}

/// Validate the Bot API key by making a test API call
#[tauri::command]
pub async fn validate_bot_api_key(state: State<'_, AppState>) -> Result<bool, String> {
    let api_key = get_raw_api_key(&state.launch_dir).ok_or("No API key configured")?;

    validate_api_key(&api_key).await
}

/// Mask an API key for display.
/// Char-boundary safe: byte slicing would panic if a pasted key contained a
/// multibyte character (smart quote, em-dash) straddling the offsets.
fn mask_api_key(key: &str) -> String {
    let chars: Vec<char> = key.chars().collect();
    if chars.len() <= 12 {
        return "*".repeat(chars.len());
    }
    let prefix: String = chars[..8].iter().collect();
    let suffix: String = chars[chars.len() - 4..].iter().collect();
    format!("{}...{}", prefix, suffix)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mask_api_key_long() {
        let masked = mask_api_key("sk-ant-api03-abcdefghijklmnop");
        assert_eq!(masked, "sk-ant-a...mnop");
    }

    #[test]
    fn test_mask_api_key_short() {
        let masked = mask_api_key("short");
        assert_eq!(masked, "*****");
    }

    #[test]
    fn test_mask_api_key_multibyte() {
        // Must not panic on multibyte chars near the slice offsets
        let masked = mask_api_key("sk-ant-“pasted-with-smart-quotes”");
        assert!(masked.contains("..."));
        let masked = mask_api_key("é€😀-short");
        assert_eq!(masked, "*********"); // 9 chars -> 9 stars
    }
}
