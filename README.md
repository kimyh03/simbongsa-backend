# Simbongsa-server(Hoony Portfolio)

- 봉사활동 모집공고를 등록하고 지원 할 수 있습니다.

---

## Stacks

- Typescript
- Node.js
- Nest.js
- GraphQL
- TypeORM(postgreSQL)
- Jest.js

---

## Entities

- User (서비스 사용자)
- Post (봉사활동 모집공고)
- Application (봉사활동 신청)
- Like (모집공고 좋아요/북마크)
- Answer (모집공고에 대한 질문)
- Question (위 질문에 대한 답변)
- Certificate (봉사활동 증명서)

---

## APIs

### User

- [x] signUp // 10월 16일
- [x] signIn // 10월 16일
- [x] getProfile(+isSelf) // 10월 16일 //10월 27일
- [ ] editAvatar
  
### Post

- [x] getPosts(filter, pagination, search) // 10월 19일
- [x] getPostDetail(+isMine, isLiked) // 10월 19일
- [x] createPost // 10월 19일
- [x] editPost // 10월 19일
- [x] toggleOpenAndClose // 10월 19일
- [x] completePost // 10월 20일
- [x] deletePost // 10월 19일

### Application

- [x] toggleApply // 10월 29일(apply, cancel 통합)
- [x] handleApplication // 10월 21일

### Like

- [x] toggleLike // 10월 20일

### Question

- [x] createQuestion // 10월 20일
- [x] deleteQuestion // 10월 20일

### Answer

- [x] createAnswer // 10월 20일

### Certificate
