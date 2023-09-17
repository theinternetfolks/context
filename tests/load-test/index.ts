import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "5s", target: 500 },
    { duration: "5s", target: 1000 },
    { duration: "5s", target: 2000 },
    { duration: "5s", target: 3000 },
    { duration: "5s", target: 4000 },
    { duration: "5s", target: 5000 },
    { duration: "5s", target: 6000 },
    { duration: "5s", target: 7000 },
    { duration: "5s", target: 8000 },
    { duration: "5s", target: 9000 },
    { duration: "5s", target: 10000 },
    { duration: "10s", target: 0 },
  ],
};

const getRandom = () =>
  parseInt((Math.random() * 10000).toString(), 10).toString();

export default function () {
  const value = getRandom();
  const res = http.get(`http://localhost:3000?value=${value}`);
  check(res, {
    "value matches": (r) => {
      return r.body === value;
    },
  });
  sleep(1);
}
