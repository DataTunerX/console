import { findDuplicateIndices } from '@/utils/findDuplicate';

describe('findDuplicateIndices with custom mapper', () => {
  it('should return indices of duplicate elements based on the provided mapper', () => {
    const jobs = [
      {
        id: 1,
        name: 'Job1',
      },
      {
        id: 2,
        name: 'Job2',
      },
      {
        id: 1,
        name: 'Job3',
      },
      {
        id: 3,
        name: 'Job4',
      },
      {
        id: 2,
        name: 'Job5',
      },
    ];

    const result = findDuplicateIndices(jobs, (job) => job.name);

    expect(result).toEqual([]);
  });

  it('should return an empty array if there are no duplicates with the provided mapper', () => {
    const jobs = [
      {
        id: 1,
        name: 'Job1',
      },
      {
        id: 2,
        name: 'Job2',
      },
      {
        id: 3,
        name: 'Job3',
      },
      {
        id: 4,
        name: 'Job4',
      },
      {
        id: 5,
        name: 'Job5',
      },
    ];

    const result = findDuplicateIndices(jobs, (job) => job.name);

    expect(result).toEqual([]);
  });
});
