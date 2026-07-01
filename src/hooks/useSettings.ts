import { createSignal, onMount, createEffect, Accessor } from "solid-js";
import {
  getConfig,
  saveConfig,
  hasLocalConfig,
  listColorSchemes,
  getCurrentModel,
  getLaunchDir,
  openInNewWindow,
  ColorSchemeInfo,
} from "../lib/tauri";
import {
  applyMargin,
  applyFont,
  applyFontSize,
  applyColorScheme,
} from "../lib/theme-utils";

export interface FontOption {
  label: string;
  value: string;
}

export interface ModelOption {
  label: string;
  value: string;
  /**
   * Model family. Defaults to "claude" (Anthropic, native auth). "router" marks a
   * non-Claude model proxied through Claude Code Router (ccr); the bridge points the
   * Claude CLI at the local ccr endpoint and the window gets an accent outline.
   */
  family?: "claude" | "router";
  /** Outline accent colour for the window when this model is active (router models). */
  accent?: string;
}

export interface UseSettingsReturn {
  // State
  isOpen: Accessor<boolean>;
  contentMargin: Accessor<number>;
  fontFamily: Accessor<string>;
  fontSize: Accessor<number>;
  colorScheme: Accessor<string | null>;
  availableSchemes: Accessor<ColorSchemeInfo[]>;
  availableFonts: FontOption[];
  saveLocally: Accessor<boolean>;
  sandboxEnabled: Accessor<boolean>;
  claudeModel: Accessor<string>;
  availableModels: ModelOption[];

  // Actions
  openSettings: () => void;
  closeSettings: () => void;
  setContentMargin: (margin: number) => void;
  setFontFamily: (font: string) => void;
  setFontSize: (size: number) => void;
  setColorScheme: (scheme: string | null) => void;
  setSaveLocally: (locally: boolean) => void;
  setSandboxEnabled: (enabled: boolean) => void;
  setClaudeModel: (model: string) => Promise<void>;
  resetToDefaults: () => void;
}

const CURATED_FONTS: FontOption[] = [
  // Monospace
  { label: "SF Mono", value: "'SF Mono', Menlo, Monaco, monospace" },
  // Modern sans-serif
  { label: "SF Pro", value: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif" },
  { label: "Avenir Next", value: "'Avenir Next', Avenir, 'Helvetica Neue', sans-serif" },
  // Modern serif
  { label: "New York", value: "'New York', 'Iowan Old Style', Georgia, serif" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
];

const CURATED_MODELS: ModelOption[] = [
  { label: "Fable 5", value: "fable" },
  { label: "Opus 4.8", value: "opus" },
  { label: "Opus 4.7", value: "claude-opus-4-7" },
  { label: "Opus 4.6", value: "claude-opus-4-6" },
  { label: "Sonnet 5", value: "claude-sonnet-5" },
  { label: "Sonnet 4.6", value: "sonnet" },
  // Non-Claude models proxied through Claude Code Router (ccr must be running).
  // Selecting one opens a new window routed to ccr, flagged with a lime outline.
  { label: "GLM 5.2 (Nebius)", value: "glm-5.2", family: "router", accent: "#a3e635" },
];

const DEFAULT_MARGIN = 16;
const DEFAULT_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif";
const DEFAULT_FONT_SIZE = 16;
const DEFAULT_SCHEME = "Gruvbox Dark";
const DEFAULT_MODEL = "opus";

/**
 * Hook for managing appearance settings with live preview and persistence.
 */
export function useSettings(): UseSettingsReturn {
  const [isOpen, setIsOpen] = createSignal(false);
  const [contentMargin, setContentMarginSignal] = createSignal(DEFAULT_MARGIN);
  const [fontFamily, setFontFamilySignal] = createSignal(DEFAULT_FONT);
  const [fontSize, setFontSizeSignal] = createSignal(DEFAULT_FONT_SIZE);
  const [colorScheme, setColorSchemeSignal] = createSignal<string | null>(
    DEFAULT_SCHEME
  );
  const [availableSchemes, setAvailableSchemes] = createSignal<
    ColorSchemeInfo[]
  >([]);
  const [saveLocally, setSaveLocallySignal] = createSignal(false);
  const [sandboxEnabled, setSandboxEnabledSignal] = createSignal(true);
  const [claudeModel, setClaudeModelSignal] = createSignal(DEFAULT_MODEL);

  // Load settings on mount
  onMount(async () => {
    try {
      // Load config
      const config = await getConfig();
      setContentMarginSignal(config.content_margin ?? DEFAULT_MARGIN);
      setFontFamilySignal(config.font_family ?? DEFAULT_FONT);
      setFontSizeSignal(config.font_size ?? DEFAULT_FONT_SIZE);
      setColorSchemeSignal(config.color_scheme ?? DEFAULT_SCHEME);
      setSandboxEnabledSignal(config.sandbox_enabled ?? true);
      // Read the live model for this window (env override wins over config).
      try {
        setClaudeModelSignal(await getCurrentModel());
      } catch {
        setClaudeModelSignal(config.claude_model ?? DEFAULT_MODEL);
      }

      // Check if we're using a local config
      const isLocal = await hasLocalConfig();
      setSaveLocallySignal(isLocal);

      // Apply settings to CSS
      applyMargin(config.content_margin ?? DEFAULT_MARGIN);
      applyFont(config.font_family ?? DEFAULT_FONT);
      applyFontSize(config.font_size ?? DEFAULT_FONT_SIZE);
      if (config.color_scheme) {
        await applyColorScheme(config.color_scheme);
      }

      // Load available color schemes
      const schemes = await listColorSchemes();
      setAvailableSchemes(schemes);
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
  });

  // Live preview: apply margin changes immediately
  createEffect(() => {
    applyMargin(contentMargin());
  });

  // Live preview: apply font changes immediately
  createEffect(() => {
    applyFont(fontFamily());
  });

  // Live preview: apply font size changes immediately
  createEffect(() => {
    applyFontSize(fontSize());
  });

  // Persist changes to config.
  //
  // Debounced + serialized: the sliders call this on every onInput step while
  // dragging, and each call does an async read-modify-write of the config
  // file. Unserialized, a slow earlier getConfig can complete after a later
  // one and persist stale values (last-write-wins on the file). The debounce
  // collapses drag bursts; the promise chain guarantees write ordering. The
  // signal reads happen inside doPersist, so the final write always carries
  // the latest values.
  let persistTimer: ReturnType<typeof setTimeout> | undefined;
  let persistQueue: Promise<void> = Promise.resolve();

  const doPersist = async () => {
    try {
      const config = await getConfig();
      await saveConfig(
        {
          ...config,
          content_margin: contentMargin(),
          font_family: fontFamily(),
          font_size: fontSize(),
          color_scheme: colorScheme() ?? undefined,
          sandbox_enabled: sandboxEnabled(),
        },
        saveLocally()
      );
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  };

  const persistSettings = () => {
    if (persistTimer !== undefined) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      persistTimer = undefined;
      persistQueue = persistQueue.then(doPersist);
    }, 300);
  };

  const setContentMargin = (margin: number) => {
    setContentMarginSignal(margin);
    persistSettings();
  };

  const setFontFamily = (font: string) => {
    setFontFamilySignal(font);
    persistSettings();
  };

  const setFontSize = (size: number) => {
    setFontSizeSignal(size);
    persistSettings();
  };

  const setColorScheme = async (scheme: string | null) => {
    setColorSchemeSignal(scheme);
    if (scheme) {
      await applyColorScheme(scheme);
    }
    persistSettings();
  };

  const setSaveLocally = (locally: boolean) => {
    setSaveLocallySignal(locally);
    // Re-persist with new locality setting
    persistSettings();
  };

  const setSandboxEnabled = (enabled: boolean) => {
    setSandboxEnabledSignal(enabled);
    persistSettings();
  };

  const setClaudeModel = async (model: string) => {
    // Picking a different model opens a new window in the same working directory
    // running that model — it does NOT mutate the current window or the persisted config.
    if (model === claudeModel()) return;
    try {
      const dir = await getLaunchDir();
      await openInNewWindow(dir, model);
      setIsOpen(false);
    } catch (e) {
      console.error("Failed to open new window with model:", e);
    }
  };

  const resetToDefaults = async () => {
    setContentMarginSignal(DEFAULT_MARGIN);
    setFontFamilySignal(DEFAULT_FONT);
    setFontSizeSignal(DEFAULT_FONT_SIZE);
    setColorSchemeSignal(DEFAULT_SCHEME);
    await applyColorScheme(DEFAULT_SCHEME);
    persistSettings();
  };

  return {
    isOpen,
    contentMargin,
    fontFamily,
    fontSize,
    colorScheme,
    availableSchemes,
    availableFonts: CURATED_FONTS,
    saveLocally,
    sandboxEnabled,
    claudeModel,
    availableModels: CURATED_MODELS,
    openSettings: () => setIsOpen(true),
    closeSettings: () => setIsOpen(false),
    setContentMargin,
    setFontFamily,
    setFontSize,
    setColorScheme,
    setSaveLocally,
    setSandboxEnabled,
    setClaudeModel,
    resetToDefaults,
  };
}
