#!/usr/bin/env bash
# Dua ban moi nhat cua so tay len https://sonbeauty.github.io/note/
# Dung: ./deploy.sh  hoac  ./deploy.sh "feat: them chuong 6"
set -e

cd "$(dirname "$0")"
NOTEBOOK="$PWD"
ROOT="$(git rev-parse --show-toplevel)"
MSG="${1:-docs: update English notebook}"
# Moi lan chay mot thu muc rieng, tranh vuong file cu con bi Windows khoa
TMP="${TMPDIR:-/tmp}/note-gh-pages-$$"

# Luon don dep du script thanh cong hay that bai, neu khong lan sau se ket worktree
cleanup() {
  cd "$ROOT" 2>/dev/null || true
  git worktree remove --force "$TMP" 2>/dev/null || true
  rm -rf "$TMP" 2>/dev/null || true
  git worktree prune 2>/dev/null || true
}
trap cleanup EXIT

echo "1/4  Gop file don cho dien thoai..."
node build-single-file.js

echo "2/4  Lay nhanh gh-pages moi nhat..."
git fetch -q origin gh-pages
git worktree add -q "$TMP" gh-pages
git -C "$TMP" reset -q --hard origin/gh-pages

echo "3/4  Chep file sang..."
cp "$NOTEBOOK"/*.html "$NOTEBOOK"/*.css "$NOTEBOOK"/*.js "$NOTEBOOK/README.md" "$TMP/"

cd "$TMP"
git add -A
if git diff --cached --quiet; then
  echo "4/4  Khong co gi thay doi, khong can day len."
else
  # Khong ghi de user.name/user.email, dung dung cau hinh cua repo
  git commit -q -m "$MSG"
  git push -q origin gh-pages
  echo "4/4  Da day len. Doi 1-2 phut roi mo https://sonbeauty.github.io/note/"
fi

echo "Xong."
