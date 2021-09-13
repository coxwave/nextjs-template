import { ObjectId } from 'mongodb';
import HashIds from 'hashids';

const hashIdKey = process.env.HASHIDS_KEY;
const hashIds = new HashIds(hashIdKey);

if (process.env.NODE_ENV !== 'test' && !hashIdKey) {
  throw new Error('Missing HASHIDS_KEY');
}

export function encodeId(id: ObjectId, key = hashIdKey): string {
  return hashIds.encodeHex(String(id));
}

export function decodeId(hashed: string): ObjectId {
  return new ObjectId(hashIds.decodeHex(hashed));
}

export function encodeDocument<U = any>(input: any): U {
  if (input instanceof ObjectId) {
    return encodeId(input) as unknown as U;
  }

  if (Array.isArray(input)) {
    return input.map(encodeDocument) as unknown as U;
  }

  if (typeof input === 'object') {
    const clone = Object.entries(input).map(([k, v]) => {
      if (k.endsWith('_ids')) {
        k = k.slice(0, -4) + 'Ids';
        v = encodeDocument(v);
      } else if (k.endsWith('_id')) {
        k = k.slice(0, -3) + 'Id';
        v = encodeDocument(v);
      }
      return [k, v];
    });
    return Object.fromEntries(clone);
  }

  return input;
}

// class EncrypedeId {
//   Id: string;

//   constructor(key: string) {
//     this.Id = Id;
//   }

//   get(): string {
//     return this.Id;
//   }

//   toJSON(): Object {
//     return {
//       Id: this.Id,
//     };
//   }
// }
