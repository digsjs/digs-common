'use strict';

class BoardError extends Error {
  constructor(message, board) {
    super(message);
    this.board = board;
  }
}

class InvalidParameterError extends Error {
  constructor(message) {
    super(message || 'Invalid parameters');
  }
}

class ForkError extends BoardError {
  constructor(message, board) {
    super(`${board}: failed to fork after ${board.retryMaxTries}
    attempts: ${message}`, board);
  }
}

class NotReadyError extends BoardError {
  constructor(message, board) {
    super(`${board}: failed to become ready after max tries reached
    (${board.retryMaxTries}): ${message}`, board);
  }
}

module.exports = {
  ForkError: ForkError,
  NotReadyError: NotReadyError,
  BoardError: BoardError,
  InvalidParameterError: InvalidParameterError
};
