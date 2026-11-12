#!/usr/bin/env python3
"""
Pre-render (inline) or restore [data-plop-section] slots across note-garden topics.

Usage:
  python3 scripts/prerender-sections.py --inline   # Inline full sections/*.html into <div data-plop-section="...">
  python3 scripts/prerender-sections.py --check    # Verify all [data-plop-section] links and fallback content
"""
import argparse
import glob
import os
import re

TOPICS = ["mysql", "postgres", "redis", "go", "os", "mq"]

SLOT_PATTERN = re.compile(
    r'(<div\s+data-plop-section="([^"]+)"[^>]*>)(.*?)(</div>\s*(?=\n\s*<div\s+data-plop-section=|\n\s*</div>\s*</main>))',
    re.DOTALL,
)


def check_topics():
    for topic in TOPICS:
        idx_path = os.path.join(topic, "index.html")
        if not os.path.exists(idx_path):
            continue
        with open(idx_path, "r", encoding="utf-8") as f:
            html = f.read()
        slots = re.findall(r'data-plop-section="([^"]+)"', html)
        has_noscript = "<noscript>" in html
        links = re.findall(r'<a href="(sections/[^"]+\.html)">', html)
        missing = [
            s for s in slots if not os.path.exists(os.path.join(topic, s))
        ]
        print(
            f"[{topic:8s}] slots={len(slots):2d} | static_links={len(links):2d} | noscript={has_noscript} | missing_files={missing}"
        )


def inline_topics():
    for topic in TOPICS:
        idx_path = os.path.join(topic, "index.html")
        if not os.path.exists(idx_path):
            continue
        with open(idx_path, "r", encoding="utf-8") as f:
            html = f.read()

        def repl(match):
            open_tag, rel_path, _inner, close_tag = (
                match.group(1),
                match.group(2),
                match.group(3),
                match.group(4),
            )
            sec_file = os.path.join(topic, rel_path)
            if not os.path.exists(sec_file):
                return match.group(0)
            with open(sec_file, "r", encoding="utf-8") as sf:
                sec_html = sf.read().strip()
            return f"{open_tag}\n{sec_html}\n        {close_tag}"

        new_html, count = SLOT_PATTERN.subn(repl, html)
        with open(idx_path, "w", encoding="utf-8") as f:
            f.write(new_html)
        print(f"[{topic:8s}] inlined {count} section fragments into {idx_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Manage [data-plop-section] pre-rendering")
    parser.add_argument("--inline", action="store_true", help="Inline full sections/*.html into index.html")
    parser.add_argument("--check", action="store_true", help="Check all section slots and static links")
    args = parser.parse_args()
    if args.inline:
        inline_topics()
    else:
        check_topics()
