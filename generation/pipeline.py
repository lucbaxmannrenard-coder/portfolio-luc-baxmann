#!/usr/bin/env python3
"""scroll-world pipeline (Luc Baxmann portfolio). Usage:
  python3 pipeline.py stills [name...]   # one image per section
  python3 pipeline.py legs [name...]     # forward-take legs (arch. A) - strictly sequential
Prompts read from WORK/still_<name>.txt and WORK/dive_<name>.txt.
"""
import os, sys, time, subprocess, pathlib

from google import genai
from google.genai import types

HERE = pathlib.Path(__file__).parent
WORK = pathlib.Path(os.environ.get("WORK", HERE / "work"))
ALL_NAMES = "intro web automation epi accede contact".split()

IMG_MODEL = os.environ.get("IMG_MODEL", "imagen-4.0-generate-001")
VID_MODEL = os.environ.get("VID_MODEL", "veo-3.1-generate-preview")
DIVE_SECS = int(os.environ.get("DIVE_SECS", "8"))
RESOLUTION = os.environ.get("RESOLUTION", "1080p")

GCP_PROJECT = os.environ.get("GOOGLE_CLOUD_PROJECT", "tiktok-agent-495516")
GCP_LOCATION = os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1")
client = genai.Client(vertexai=True, project=GCP_PROJECT, location=GCP_LOCATION)
WORK.mkdir(parents=True, exist_ok=True)


def gen_still(name: str):
    prompt = (WORK / f"still_{name}.txt").read_text()
    r = client.models.generate_images(
        model=IMG_MODEL, prompt=prompt,
        config=types.GenerateImagesConfig(number_of_images=1, aspect_ratio="16:9"),
    )
    r.generated_images[0].image.save(str(WORK / f"still_{name}.png"))
    print(f"still {name} ok", flush=True)


def save_video(vid, out: str):
    # Vertex returns bytes inline; AI Studio needs files.download.
    raw = getattr(vid.video, "video_bytes", None)
    if raw:
        (WORK / out).write_bytes(raw)
    else:
        client.files.download(file=vid.video)
        vid.video.save(str(WORK / out))


def gen_video(prompt_file: str, out: str, first_frame: str, secs: int):
    cfg = dict(aspect_ratio="16:9", resolution=RESOLUTION,
               duration_seconds=secs, generate_audio=False)
    op = client.models.generate_videos(
        model=VID_MODEL,
        prompt=(WORK / prompt_file).read_text(),
        image=types.Image.from_file(location=str(WORK / first_frame)),
        config=types.GenerateVideosConfig(**cfg),
    )
    while not op.done:
        time.sleep(15)
        op = client.operations.get(op)
    if op.error:
        print(f"FAIL {out}: {op.error}", flush=True)
        return False
    save_video(op.response.generated_videos[0], out)
    print(f"{out} ok", flush=True)
    return True


def extract_last(name: str):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-sseof", "-0.15",
                    "-i", str(WORK / f"dive_{name}.mp4"),
                    "-frames:v", "1", "-q:v", "2", str(WORK / f"last_{name}.png")], check=True)


cmd = sys.argv[1] if len(sys.argv) > 1 else ""
names = sys.argv[2:] or ALL_NAMES
if cmd == "stills":
    for n in names:
        gen_still(n)
elif cmd == "legs":
    for n in names:
        i = ALL_NAMES.index(n)
        first = "still_intro.png" if i == 0 else f"last_{ALL_NAMES[i-1]}.png"
        if not gen_video(f"dive_{n}.txt", f"dive_{n}.mp4", first, DIVE_SECS):
            sys.exit(1)
        extract_last(n)
else:
    print(__doc__)
