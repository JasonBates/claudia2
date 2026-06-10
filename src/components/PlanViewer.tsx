import { Component, createSignal, onMount, onCleanup, Show } from "solid-js";
import { readTextFile, watch } from "@tauri-apps/plugin-fs";
import { listen } from "@tauri-apps/api/event";
import MessageContent from "./MessageContent";
import { applyTheme, ThemeSettings } from "../lib/theme-utils";
import "../App.css";

const PlanViewer: Component = () => {
  const [content, setContent] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [filePath, setFilePath] = createSignal<string | null>(null);

  // Get URL params
  const getParams = () => new URLSearchParams(window.location.search);

  // Get plan file path from URL params
  const getFilePath = () => getParams().get("file");

  // Get theme settings from URL params
  const getThemeSettings = (): ThemeSettings | null => {
    const params = getParams();
    const colorScheme = params.get("colorScheme");
    const fontFamily = params.get("fontFamily");
    const fontSize = params.get("fontSize");
    const contentMargin = params.get("contentMargin");

    if (colorScheme && fontFamily && fontSize && contentMargin) {
      return {
        colorScheme,
        fontFamily,
        fontSize: parseInt(fontSize, 10),
        contentMargin: parseInt(contentMargin, 10),
      };
    }
    return null;
  };

  // Load plan content from file
  const loadContent = async (path: string) => {
    try {
      const text = await readTextFile(path);
      setContent(text);
      setError(null);
    } catch (e) {
      console.error("[PLAN_VIEWER] Failed to read file:", e);
      setError(`Failed to load plan: ${e}`);
    }
  };

  // Mutable holders + a synchronously registered onCleanup. Registering
  // onCleanup AFTER an await inside async onMount runs outside the SolidJS
  // owner, so it never executes and the listeners/watcher leak. The disposed
  // flag covers cleanup racing the still-pending awaits.
  let disposed = false;
  let unwatchFile: (() => void) | undefined;
  let unlisten: (() => void) | undefined;
  let unlistenTheme: (() => void) | undefined;
  let unlistenClose: (() => void) | undefined;

  onCleanup(() => {
    disposed = true;
    unlisten?.();
    unlistenTheme?.();
    unlistenClose?.();
    unwatchFile?.();
  });

  onMount(async () => {
    const path = getFilePath();
    setFilePath(path);
    console.log("[PLAN_VIEWER] Mounted with file path:", path);

    // Apply initial theme settings from URL params
    const themeSettings = getThemeSettings();
    if (themeSettings) {
      console.log("[PLAN_VIEWER] Applying initial theme:", themeSettings.colorScheme);
      await applyTheme(themeSettings);
    }

    if (path) {
      await loadContent(path);

      // Watch the file for changes
      try {
        const unwatch = await watch(path, async (event) => {
          console.log("[PLAN_VIEWER] File changed:", event);
          // Reload content on any change
          await loadContent(path);
        });
        if (disposed) {
          unwatch();
        } else {
          unwatchFile = unwatch;
        }
        console.log("[PLAN_VIEWER] File watcher set up for:", path);
      } catch (e) {
        console.error("[PLAN_VIEWER] Failed to watch file:", e);
      }
    }

    // Listen for content updates from main window (backup mechanism)
    const un1 = await listen<string>("plan-content-updated", (event) => {
      console.log("[PLAN_VIEWER] Received content update event");
      setContent(event.payload);
    });

    // Listen for theme updates from main window
    const un2 = await listen<ThemeSettings>("theme-updated", async (event) => {
      console.log("[PLAN_VIEWER] Received theme update:", event.payload.colorScheme);
      await applyTheme(event.payload);
    });

    // Listen for close signal when planning ends
    const un3 = await listen("plan-window-close", () => {
      console.log("[PLAN_VIEWER] Received close signal");
      window.close();
    });

    if (disposed) {
      un1();
      un2();
      un3();
    } else {
      unlisten = un1;
      unlistenTheme = un2;
      unlistenClose = un3;
    }
  });

  return (
    <div class="plan-viewer">
      <div class="plan-viewer-header">
        <div class="drag-region" data-tauri-drag-region="true"></div>
        <span class="plan-viewer-title">Plan</span>
        <Show when={filePath()}>
          <span class="plan-viewer-path">{filePath()?.split("/").pop()}</span>
        </Show>
      </div>

      <Show when={error()}>
        <div class="plan-viewer-error">{error()}</div>
      </Show>

      <div class="plan-viewer-content">
        <Show when={content()} fallback={<div class="plan-viewer-loading">Loading plan...</div>}>
          <MessageContent content={content()} />
        </Show>
      </div>
    </div>
  );
};

export default PlanViewer;
