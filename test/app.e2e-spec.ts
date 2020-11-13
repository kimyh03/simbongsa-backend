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
  let userRepository: Repository<User>;
  let postRepository: Repository<Post>;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    userRepository = module.get(getRepositoryToken(User));
    postRepository = module.get(getRepositoryToken(Post));
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  //User
  describe('signUp', () => {
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
    it('should fail with notFound id', () => {
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

  it.todo('editAvatar');

  //Post
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
    it('should fail with notFound id', () => {
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
  it.todo('toggleOpenAndClose');
  it.todo('deletePost');
  it.todo('getPosts');
  it.todo('completePost');

  //Like
  it.todo('toggleLike');

  //Question
  it.todo('createQuestion');

  //Answer
  it.todo('answerTheQuestion');

  //Application
  it.todo('toggleApply');
  it.todo('handleApplication');
});
