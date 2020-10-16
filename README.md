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

---

## APIs

### User

- [x] signUp // 10월 16일
- [ ] signIn
- [ ] getProfile(+isSelf)
- [ ] editAvatar
  
### Post

- [ ] getPosts(filter, cursor based pagination)
- [ ] searchPost
- [ ] getPostDetail(+isMine, isLiked)
- [ ] createPost
- [ ] editPost
- [ ] toggleOpenAndClose
- [ ] completePost
- [ ] getMyPosts

### Application

- [ ] applyForPost
- [ ] acceptApplication
- [ ] cancelApplication
- [ ] getMyApplications

### Like

- [ ] toggleLike
- [ ] getMyLikes

### Question

- [ ] createQuestion
- [ ] deleteQuestion

### Answer

- [ ] createAnswer
