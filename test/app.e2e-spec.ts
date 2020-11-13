import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { getConnection } from 'typeorm';

describe('AppResolver (e2e)', () => {
  let app: INestApplication;

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
  it.todo('signUp');
  it.todo('signIn');
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
