import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { getConnection } from 'typeorm';
import * as request from 'supertest';

describe('AppResolver (e2e)', () => {
  let app: INestApplication;
  const GRAPHQL_ENDPOINT = '/graphql';
  const testUser = {
    username: 'Hoony',
    email: 'Hoony@hoony.com',
    password: '123',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
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
  it.todo('getProfile');
  it.todo('editAvatar');

  //Post
  it.todo('createPost');
  it.todo('getPostDetail');
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
