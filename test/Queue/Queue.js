"use strict";

const Queue = require("../../lib/Queue/Queue");
const { async } = require("naughty-util");


module.exports = () => {
  // {
  //   const queue = new Queue({ concurrency: 5 });

  //   const job = async (task) => {
  //     const { interval } = task.params[0];
  //     await async.pause(interval);
  //     return interval;
  //   };

  //   queue.process(job);

  //   queue.on("success", async (task) => {
  //     console.log(task);
  //   });

  //   queue.on("error", async (task) => {
  //     const { error } = task;
  //     console.log(error.message);
  //   });

  //   queue.on("drain", async () => {
  //     console.log('Queue drain');
  //   });

  //   for (let i = 0; i < 1000; i++) {
  //     const task = { name: `Task${i}`, interval: Math.floor(Math.random() * 200) };
  //     queue.enqueue(task);
  //   }
  // }

  // {
  //   const queue = new Queue({ concurrency: 10, wait: 1000 });

  //   const job = async (task) => {
  //     const { interval } = task.params[0];
  //     await async.pause(interval);
  //     return interval;
  //   };

  //   queue.process(job);

  //   queue.on("success", async (task) => {
  //     console.log(task);
  //   });

  //   queue.on("error", async (task) => {
  //     const { error } = task;
  //     console.log(error.message);
  //   });

  //   queue.on("drain", async () => {
  //     console.log('Queue drain');
  //   });

  //   for (let i = 0; i < 1000; i++) {
  //     const task = { name: `Task${i}`, interval: Math.floor(Math.random() * 200) };
  //     queue.enqueue(task);
  //   }
  // }

  // {
  //   const queue = new Queue({ concurrency: 2, timeout: 1000 });

  //   const job = async (task) => {
  //     const { interval } = task.params[0];
  //     await async.pause(interval);
  //     return interval;
  //   };

  //   queue.process(job);

  //   queue.on("success", async (task) => {
  //     console.log(task);
  //   });

  //   queue.on("error", async (task) => {
  //     const { error } = task;
  //     console.log(error.message);
  //   });

  //   queue.on("drain", async () => {
  //     console.log('Queue drain');
  //   });

  //   for (let i = 0; i < 1000; i++) {
  //     const task = { name: `Task${i}`, interval: Math.floor(Math.random() * 200) };
  //     queue.enqueue(task);
  //   }
  // }

  // {
  //   const queue = new Queue({ concurrency: 100, timeout: 500, wait: 1000 });

  //   const job = async (task) => {
  //     const { interval } = task.params[0];
  //     await async.pause(interval);
  //     return interval;
  //   };

  //   queue.process(job);

  //   queue.on("success", async (task) => {
  //     console.log(task);
  //   });

  //   queue.on("error", async (task) => {
  //     const { error } = task;
  //     console.log(error.message);
  //   });

  //   queue.on("drain", async () => {
  //     console.log('Queue drain');
  //   });

  //   for (let i = 0; i < 1000; i++) {
  //     const task = { name: `Task${i}`, interval: Math.floor(Math.random() * 200) };
  //     queue.enqueue(task);
  //   }
  // }
};