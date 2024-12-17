#!/bin/bash

# package.json에서 name 가져오기
NAME=$(jq -r '.name' package.json)

# 현재 Git 커밋 ID 가져오기
TAG=$(git rev-parse --short HEAD)

# 사용자 입력 받기
read -p "추가 태그 입력 (없으면 Enter): " INPUT_TAG

# 입력값이 있으면 태그 뒤에 -{input} 추가
if [[ -n "$INPUT_TAG" ]]; then
  TAG="${TAG}-${INPUT_TAG}"
fi

# 이미지 이름과 태그 설정
IMAGE_NAME="${NAME}:${TAG}"
TAR_FILE="${NAME}_${TAG}.tar"

# 이미지 빌드
podman build --platform linux/amd64 -t "$IMAGE_NAME" .

# 이미지 저장
podman save -o "$TAR_FILE" "$IMAGE_NAME"

echo "이미지 빌드 및 저장 완료:"
echo "이미지 이름: $IMAGE_NAME"
echo "저장된 파일: $TAR_FILE"

