import { describe, it, expect } from 'vitest';
import { getRelevantLiveData } from './liveData';

describe('getRelevantLiveData', () => {
  const mockSnapshot = {
    foodCourts: [{ id: 'food1' }],
    parking: [{ id: 'park1' }],
    washrooms: [{ id: 'wash1' }],
    gates: [{ id: 'gate1' }],
    weather: { temperatureC: 25 },
  };

  it('returns food data when asking about food', () => {
    const result = getRelevantLiveData('where can i eat?', mockSnapshot);
    expect(result.foodCourts).toBeDefined();
    expect(result.parking).toBeUndefined();
  });

  it('returns parking data when asking about cars', () => {
    const result = getRelevantLiveData('where to park my car', mockSnapshot);
    expect(result.parking).toBeDefined();
    expect(result.foodCourts).toBeUndefined();
  });

  it('returns multiple datasets if multiple keywords are present', () => {
    const result = getRelevantLiveData('where is the closest food court and restroom?', mockSnapshot);
    expect(result.foodCourts).toBeDefined();
    expect(result.washrooms).toBeDefined();
    expect(result.gates).toBeUndefined();
  });

  it('returns an empty object if no relevant keywords are found', () => {
    const result = getRelevantLiveData('who is playing today?', mockSnapshot);
    expect(Object.keys(result).length).toBe(0);
  });
});
