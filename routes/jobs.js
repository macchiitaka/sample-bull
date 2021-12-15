const express = require('express');
const Bull = require('bull');

// eslint-disable-next-line new-cap
const router = express.Router();

const heavyJob = async () =>
  new Promise((resolve) => {
    setInterval(() => {
      resolve();
    }, 3000);
  });

const queue = new Bull('bulltest', {
  redis: {
    port: 6379,
    host: '127.0.0.1',
  },
});

const processor = 'sample_processor'; // 処理名
const concurrency = 9; // 並行処理数

queue.process(processor, concurrency, async (job, done) => {
  try {
    console.log('start');
    await heavyJob();
    console.log('end');
    done();
  } catch (error) {
    done(error);
  }
});

router.post('/', (req, res) => {
  const data = { greetingTime: new Date().toString() }; // jobのデータ(object)
  queue.add(processor, data);
  res.send('ok');
});

module.exports = router;
