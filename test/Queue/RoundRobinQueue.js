'use strict';

const { async } = require("naughty-util");
const RoundRobinQueue = require("../../lib/Queue/RoundRobinQueue.js");

const categorize = () => Math.floor((Math.random() * 5)) + 1;

module.exports = () => {
  const queue = new RoundRobinQueue({ concurrency: 25, categorize, timeout: 300, wait: 1000 });
  queue.process(async (task) => {
    const interval = task.params[0].interval;
    await async.pause(interval);
    return interval;
  });

  queue.on("success", async (task) => {
    console.log(task);
  });

  queue.on("error", async ({ error }) => {
    console.log(error.message);
  });

  queue.on("drain", async () => {
    console.log('Queue drain');
  });

  for (let i = 0; i < 1000; i++) {
    const task = { name: `Task${i}`, interval: Math.floor(Math.random() * 400) };
    queue.enqueue(task);
  }
};
