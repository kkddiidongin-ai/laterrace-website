# laterrace Website — 버전 관리

## 버전 목록

### v1.0 (2026-05-13)
**커밋:** `17b424d`
**태그:** `v1.0`

**포함된 작업:**
- navbar 리디자인 (Sun Siyam 스타일: 좌측 OFFERS+BOOK pill, 중앙 로고, 우측 EN+햄버거)
- 워드마크 페이드인 애니메이션
- 실제 라테라스/깔라까따 사진 전 섹션 적용
- Hero 영상: 깔라까따 full 4K HLS 스트리밍
- HLS 즉시재생 최적화 (poster 이미지, preload:auto, startLevel:-1)
- Be Rewarded 섹션 이미지 교체 (인피니티풀 고급 사진)

---

## 롤백 방법

### v1.0으로 롤백하기

```bash
# 1. 저장소 클론 (최초 1회)
gh repo clone kkddiidongin-ai/laterrace-website laterrace-website
cd laterrace-website

# 2. v1.0 태그로 체크아웃
git checkout v1.0

# 3. 새 브랜치로 분기 (선택사항)
git checkout -b rollback-v1.0

# 4. main 브랜치를 v1.0으로 강제 리셋 후 push
git checkout main
git reset --hard v1.0
git push origin main --force
```

> **주의:** `--force` push는 이후 커밋을 모두 덮어씁니다. 필요 시 현재 상태를 먼저 별도 브랜치로 백업하세요.

---

## GitHub 태그 확인

- GitHub 저장소: https://github.com/kkddiidongin-ai/laterrace-website
- 태그 목록: https://github.com/kkddiidongin-ai/laterrace-website/tags
- v1.0 릴리즈: https://github.com/kkddiidongin-ai/laterrace-website/tree/v1.0
