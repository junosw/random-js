const arr = ["we", "love", "the", "Gorge"];
// console.log(...arr);

const str = "We love the Gorge";
// console.log(...str);

/* "Better" array concat */
let arr1 = [0, 1, 2];
let arr2 = [3, 4, 5];

arr1 = [...arr1, ...arr2];
//  arr1 is now [0, 1, 2, 3, 4, 5]
// Note: Not to use const otherwise, it will give TypeError (invalid assignment)
console.log(arr1);

const local = {
  redis: {
    domain: "localhost",
  },
  internal: {
    projectSendBack: {
      apiToken: "4232",
    },
  },
};

const development = {
  redis: {
    domain: "redis.dev.env.sketchdeck.com",
  },
  paid: {
    key: "sk_123",
  },
};

const all = { ...development, ...local };
console.log(all);
