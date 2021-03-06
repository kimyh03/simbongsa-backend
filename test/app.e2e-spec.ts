import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { getConnection, Repository } from 'typeorm';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { postCategoryEnum } from 'src/post/dto/postCategory.enum';
import { postRigionEnum } from 'src/post/dto/postRigion.enum';
import { Post } from 'src/post/post.entity';
import { Question } from 'src/question/question.entity';
import { Application } from 'src/application/application.entity';
import { applicationStatus } from 'src/application/dto/ApplicationStatus.enum';

describe('AppResolver (e2e)', () => {
  let app: INestApplication;
  const GRAPHQL_ENDPOINT = '/graphql';
  const testUser = {
    username: 'Hoony',
    email: 'Hoony@hoony.com',
    password: '123',
  };
  const testPost = {
    title: 'test',
    description: 'test',
    category: postCategoryEnum.communityService,
    rigion: postRigionEnum.Seoul,
    adress: 'test',
    host: 'test',
    NumOfRecruitment: 1,
    recognizedHours: 1,
    date: '2020.11.11',
  };
  let jwt: string;
  let fakeJwt: string;
  let userRepository: Repository<User>;
  let postRepository: Repository<Post>;
  let questionRepository: Repository<Question>;
  let applicationRepository: Repository<Application>;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    userRepository = module.get(getRepositoryToken(User));
    postRepository = module.get(getRepositoryToken(Post));
    questionRepository = module.get(getRepositoryToken(Question));
    applicationRepository = module.get(getRepositoryToken(Application));
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });
  describe('signUp', () => {
    it('fake user', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{
            signUp(args:{
              username:"fake",
              email:"fake@fake.com",
              password:"fake",
            }){
              ok
              error
              token
            }
          }
        `,
        })
        .expect(200)
        .expect(res => {
          fakeJwt = res.body.data.signUp.token;
        });
    });
    it('should create account', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
            mutation{
              signUp(args:{
                username:"${testUser.username}",
                email:"${testUser.email}",
                password:"${testUser.password}",
              }){
                ok
                error
                token
              }
            }
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                signUp: { ok, error, token },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(token).toEqual(expect.any(String));
        });
    });
    it('should fail with exist email', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
            mutation{
              signUp(args:{
                username:"test",
                email:"${testUser.email}",
                password:"test",
              }){
                ok
                error
                token
              }
            }
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                signUp: { ok, error, token },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
          expect(token).toBe(null);
        });
    });
    it('should fail with exist username', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{
            signUp(args:{
              username:"${testUser.username}",
              email:"test",
              password:"test",
            }){
              ok
              error
              token
            }
          }`,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                signUp: { ok, error, token },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
          expect(token).toBe(null);
        });
    });
  });
  describe('signIn', () => {
    it('should log in', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{
            signIn(args:{
              email:"${testUser.email}",
              password:"${testUser.password}"
            }){
              ok
              error
              token
            }
          }
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                signIn: { ok, error, token },
              },
            },
          } = res;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          jwt = token;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(token).toEqual(expect.any(String));
        });
    });
    it('should fail with wrong email', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{
            signIn(args:{
              email:"test",
              password:"${testUser.password}",
            }){
              ok
              error
              token
            }
          }`,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                signIn: { ok, error, token },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
          expect(token).toBe(null);
        });
    });
    it('should fail with wrong password', () => {
      request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{
            signIn(args:{
              email:"${testUser.email}",
              password:"test"
            }){
              ok
              error
              token
            }
          }
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                signIn: { ok, error, token },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
          expect(token).toBe(null);
        });
    });
  });
  describe('getProfile', () => {
    let user: User;
    beforeAll(async () => {
      user = await userRepository.findOne({
        email: testUser.email,
      });
    });
    it('should get my profile', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `{
            getProfile(args:{userId:${user.id}}){
              ok
              error
              isSelf
              user{
                id
              }
              likes{
                id
              }
              applications{
                id
              }
            }
          }`,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                getProfile: { ok, error, isSelf, user, likes, applications },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(isSelf).toBe(true);
          expect(user).toEqual(expect.any(Object));
          expect(likes).toEqual(expect.any(Array));
          expect(applications).toEqual(expect.any(Array));
        });
    });
    it('should get others profile', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `{
            getProfile(args:{userId:${user.id}}){
              ok
              error
              isSelf
              user{
                id
              }
              likes{
                id
              }
              applications{
                id
              }
            }
          }`,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                getProfile: { ok, error, isSelf, user, likes, applications },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(isSelf).toBe(false);
          expect(user).toEqual(expect.any(Object));
          expect(likes).toBe(null);
          expect(applications).toBe(null);
        });
    });
    it('should fail with notFound userId', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `{
            getProfile(args:{userId:666}){
              ok
              error
            }
          }`,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                getProfile: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
  });
  describe('createPost', () => {
    it('should create post', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
            mutation{
              createPost(args:{
                title: "${testPost.title}",
                description: "${testPost.description}",
                category: ${testPost.category},
                rigion: ${testPost.rigion},
                adress: "${testPost.adress}",
                host: "${testPost.host}",
                NumOfRecruitment: ${testPost.NumOfRecruitment},
                recognizedHours: ${testPost.recognizedHours},
                date: "${testPost.date}"
              }){
                ok
                error
              }
            }
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                createPost: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should fail without jwt', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
            mutation{
              createPost(args:{
                title: "${testPost.title}",
                description: "${testPost.description}",
                category: ${testPost.category},
                rigion: ${testPost.rigion},
                adress: "${testPost.adress}",
                host: "${testPost.host}",
                NumOfRecruitment: ${testPost.NumOfRecruitment},
                recognizedHours: ${testPost.recognizedHours},
                date: "${testPost.date}"
              }){
                ok
                error
              }
            }
          `,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.errors[0].message).toBe('Forbidden resource');
        });
    });
  });
  describe('getPostDetail', () => {
    let post: Post;
    beforeAll(async () => {
      post = await postRepository.findOne({ where: { title: testPost.title } });
    });
    it('should get post detail', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `{
            getPostDetail(args:{postId:${post.id}}){
              ok
              error
              post{
                id
              }
              isMine
              isLiked
              isApplied
              questions{
                id
              }
              applications{
                id
              }
            }
          }`,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                getPostDetail: {
                  ok,
                  error,
                  post,
                  isMine,
                  isLiked,
                  isApplied,
                  questions,
                  applications,
                },
              },
            },
          } = res;

          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(post).toEqual(expect.any(Object));
          expect(isMine).toBe(false);
          expect(isLiked).toBe(false);
          expect(isApplied).toBe(false);
          expect(questions).toEqual(expect.any(Object));
          expect(applications).toEqual(expect.any(Object));
        });
    });
    it('should fail with notFound postId', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `{
          getPostDetail(args:{postId:666}){
            ok
            error
          }
        }`,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                getPostDetail: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
  });
  describe('getPosts', () => {
    it('should get posts', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          {
            getPosts(args:{
              page:1, 
              openOnly:false, 
              categories:[], 
              rigions:[], 
              searchTerm:""}){
            ok
            error
            posts{
              id
            }
            totalCount
            totalPage
          }
        }
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                getPosts: { ok, error, posts, totalCount, totalPage },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(posts).toEqual(expect.any(Array));
          expect(totalCount).toBe(1);
          expect(totalPage).toBe(1);
        });
    });
  });
  describe('toggleLike', () => {
    let post: Post;
    beforeAll(async () => {
      post = await postRepository.findOne({ where: { title: testPost.title } });
    });
    it('should toggle like', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{toggleLike(args:{postId:${post.id}}){
            ok
            error
          }}`,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                toggleLike: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should fail with notFound postId', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{toggleLike(args:{postId:666}){
            ok
            error
          }}`,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                toggleLike: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
    it('should fail without jwt', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{toggleLike(args:{postId:${post.id}}){
            ok
            error
          }}`,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.errors[0].message).toBe('Forbidden resource');
        });
    });
  });
  describe('createQuestion', () => {
    let post: Post;
    beforeAll(async () => {
      post = await postRepository.findOne({ where: { title: testPost.title } });
    });
    it('should create qeustion', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{createQuestion(args:{postId:${post.id}, text:"test"}){
            ok
            error
          }}
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                createQuestion: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should fail with notFound postId', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{createQuestion(args:{postId:666, text:"test"}){
            ok
            error
          }}
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                createQuestion: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
    it('should fail without jwt', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{createQuestion(args:{postId:${post.id}, text:"test"}){
            ok
            error
          }}
          `,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.errors[0].message).toBe('Forbidden resource');
        });
    });
  });
  describe('answerTheQuestion', () => {
    let question: Question;
    beforeAll(async () => {
      question = await questionRepository.findOne(1);
    });
    it('should create answer', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{
            answerTheQuestion(args:{questionId:${question.id}, text:"test"}){
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                answerTheQuestion: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should fail with notFound questionId', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{
            answerTheQuestion(args:{questionId:666, text:"test"}){
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                answerTheQuestion: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
    it('should fail without jwt of question.post.user', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${fakeJwt}` })
        .send({
          query: `
          mutation{
            answerTheQuestion(args:{questionId:${question.id}, text:"test"}){
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                answerTheQuestion: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
  });
  describe('toggleApply', () => {
    let post: Post;
    beforeAll(async () => {
      post = await postRepository.findOne(1);
    });
    it('should toggle apply', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{toggleApply(args:{postId:${post.id}}){
            ok
            error
          }}
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                toggleApply: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should fail with notFound postId', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{toggleApply(args:{postId:666}){
            ok
            error
          }}
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                toggleApply: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
    it('should fail without jwt', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{toggleApply(args:{postId:${post.id}}){
            ok
            error
          }}
          `,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.errors[0].message).toBe('Forbidden resource');
        });
    });
  });
  describe('handleApplication', () => {
    let application: Application;
    beforeAll(async () => {
      application = await applicationRepository.findOne(1);
    });
    it('should set application status', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{
            handleApplication(args:{applicationId:${application.id}, status:"${applicationStatus.accepted}"}){
              ok
              error
            }
          }`,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                handleApplication: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should fail with notFound applicationId', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{
            handleApplication(args:{applicationId:666, status:"${applicationStatus.accepted}"}){
              ok
              error
            }
          }`,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                handleApplication: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
    it('should fail without jwt of application.post.user', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${fakeJwt}` })
        .send({
          query: `
          mutation{
            handleApplication(args:{applicationId:${application.id}, status:"${applicationStatus.accepted}"}){
              ok
              error
            }
          }`,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                handleApplication: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
  });
  describe('toggleOpenAndClose', () => {
    let post: Post;
    beforeAll(async () => {
      post = await postRepository.findOne({ where: { title: testPost.title } });
    });
    it('should toggle', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{
            toggleOpenAndClose(args:{postId:${post.id}}){
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                toggleOpenAndClose: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should fail with notFound postId', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{
            toggleOpenAndClose(args:{postId:666}){
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                toggleOpenAndClose: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
    it('should fail without jwt of post.user', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${fakeJwt}` })
        .send({
          query: `
          mutation{
            toggleOpenAndClose(args:{postId:${post.id}}){
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                toggleOpenAndClose: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
  });
  describe('completePost', () => {
    let post: Post;
    beforeAll(async () => {
      post = await postRepository.findOne({ where: { title: testPost.title } });
    });
    it('should complete post', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{completePost(args:{
            postId:${post.id}
          }){
            ok
            error
          }}
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                completePost: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should fail with notFound postId', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{completePost(args:{
            postId:666
          }){
            ok
            error
          }}
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                completePost: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
    it('should fail without jwt of post.user', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${fakeJwt}` })
        .send({
          query: `
          mutation{completePost(args:{
            postId:${post.id}
          }){
            ok
            error
          }}
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                completePost: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
  });
  describe('deletePost', () => {
    let post: Post;
    beforeAll(async () => {
      post = await postRepository.findOne({ where: { title: testPost.title } });
    });
    it('should delete post', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{
            deletePost(args:{postId:${post.id}}){
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                deletePost: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should fail with notFound postId', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `
          mutation{
            deletePost(args:{postId:666}){
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                deletePost: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
    it('should fail without jwt of post.user', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ Authorization: `Bearer ${fakeJwt}` })
        .send({
          query: `
          mutation{
            deletePost(args:{postId:${post.id}}){
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                deletePost: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
  });
});
