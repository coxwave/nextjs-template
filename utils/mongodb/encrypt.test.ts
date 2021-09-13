import { ObjectId } from 'bson';
import { decodeId, encodeDocument, encodeId } from './encrypt';

describe('encrypt document', () => {
  beforeEach(() => {
    process.env.HASHIDS_KEY = 'foo';
  });

  // encodeId()
  test('test encodeId()', () => {
    const id = new ObjectId('ffffffffffffffffffffffff');
    const expected = 'BxLnqL8Z7AiQDM5DA2ox';

    expect(encodeId(id)).toBe(expected);
  });

  // decodeId()
  test('test decodeId()', () => {
    const id = 'BxLnqL8Z7AiQDM5DA2ox';
    const expected = new ObjectId('ffffffffffffffffffffffff');

    expect(decodeId(id)).toStrictEqual(expected);
  });

  // encodeDocument(Object)
  test('test encodeDocument(input: Object)', () => {
    const user = {
      _id: new ObjectId('ffffffffffffffffffffffff'),
      username: 'foo',
    };
    const expected = {
      Id: 'BxLnqL8Z7AiQDM5DA2ox',
      username: 'foo',
    };

    expect(encodeDocument(user)).toStrictEqual(expected);
  });

  // encodeDocument(Array<Object>)
  test('test encodeDocument(input: Array<Object>)', () => {
    const user = [
      {
        _id: new ObjectId('ffffffffffffffffffffffff'),
        username: 'foo',
      },
      {
        _id: new ObjectId('000000000000000000000000'),
        username: 'bar',
      },
    ];
    const expected = [
      {
        Id: 'BxLnqL8Z7AiQDM5DA2ox',
        username: 'foo',
      },
      {
        Id: '4qxrK3r1kNCyB2j82P6V',
        username: 'bar',
      },
    ];

    expect(encodeDocument(user)).toStrictEqual(expected);
  });

  // encodeDocument(Object{_ids:Array<ObjectId>})
  test('test encodeDocument(input: {_ids: Array<ObjectId>})', () => {
    const user = {
      _ids: [new ObjectId('ffffffffffffffffffffffff'), new ObjectId('000000000000000000000000')],
      username: 'foo',
    };
    const expected = {
      Ids: ['BxLnqL8Z7AiQDM5DA2ox', '4qxrK3r1kNCyB2j82P6V'],
      username: 'foo',
    };

    expect(encodeDocument(user)).toStrictEqual(expected);
  });
});
