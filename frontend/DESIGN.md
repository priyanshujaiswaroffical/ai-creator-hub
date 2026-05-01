# DESIGN SYSTEM - Master Class Portfolio

## Visual Identity
**Theme:** Cyber-Premium / Obsidian Minimal (Pro Max)
**Core Concept:** "3D Depth & Light" - Extreme Layering
The UI mimics a high-end AI command center or luxury tech. Extreme dark backgrounds combined with vibrant neon accents, animated mesh gradients, and multi-layered glassmorphism.

## 🎨 Color Palette (Pro Max expanded)
| Token | Hex/Value | Usage |
|-------|-----------|-------|
| `--bg-obsidian` | `#030305` | Absolute background (darker than void) |
| `--bg-surface` | `#08080c` | Elevated surfaces |
| `--accent-cyan` | `#00f0ff` | Primary action/glow |
| `--accent-purple` | `#7000ff` | Secondary accent |
| `--accent-pink` | `#ff007f` | Tertiary burst/mesh background |
| `--text-primary` | `#ffffff` | Headings |
| `--text-secondary` | `#a1a1aa` | Body text |
| `--glass-panel` | `rgba(255, 255, 255, 0.02)` | Card backgrounds |
| `--glass-border` | `rgba(255, 255, 255, 0.05)` | Inner borders for 3D pop |

## Typography
- **Display:** `Space Grotesk` (700, 800 - extreme tracking on small caps)
- **Body:** `Inter` (400 for regular, 500 for semi-bold)
- **Mono:** `JetBrains Mono`

## 🏗️ Components

### Cards (Glassmorphism Pro)
- **Idle:** Solid micro-border (`1px solid var(--glass-border)`), internal inset glow (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.05)`).
- **Hover:** scale(1.02), Spotlight tracking effect on mouse, border glow bounding box.

### CTAs (Magnetic)
- Primary buttons must wrap within `<Magnetic>` for natural physics.

## ✨ Effects
- **Mesh Gradients:** Slow breathing animated background blobs combining cyan, purple, and pink.
- **Advanced Noise:** 2.5% opacity TV static grain overlay rendering an analog feel over deep digital shapes.
