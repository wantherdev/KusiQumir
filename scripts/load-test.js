import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    errors: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
    response_time: ['avg<500'],
  },
};

export default function () {
  // Health check
  const health = http.get(`${BASE_URL}/api/v1/health`);
  check(health, { 'health status 200': (r) => r.status === 200 });
  errorRate.add(health.status !== 200);
  responseTime.add(health.timings.duration);

  // Get destinations
  const dests = http.get(`${BASE_URL}/api/v1/destinations`);
  check(dests, { 'destinations status 200': (r) => r.status === 200 });
  errorRate.add(dests.status !== 200);

  // Get packages
  const pkgs = http.get(`${BASE_URL}/api/v1/packages`);
  check(pkgs, { 'packages status 200': (r) => r.status === 200 });

  // Login attempt (will fail with bad creds, but tests the auth path)
  const login = http.post(`${BASE_URL}/api/v1/auth/login`, JSON.stringify({
    email: 'test@loadtest.com',
    password: 'wrong-password',
  }), { headers: { 'Content-Type': 'application/json' } });
  check(login, { 'login returns 401': (r) => r.status === 401 });

  sleep(1);
}
