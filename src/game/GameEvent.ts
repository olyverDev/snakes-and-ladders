type EventType =
  | 'gameStart'
  | 'gameEnd'
  | 'userMove'
  | 'userStartMove'
  | 'userEndMove'
  | 'nextTurn'
  | 'userOnGameObject';

type EventPayloadType = { type: EventType };

type EventListenerCallbackType = (payload: EventPayloadType) => void;

type EventRecordType = {
  listeners: { [key: number]: EventListenerCallbackType };
};

export class GameEvent {
  private static lastListenerId = 0;
  private static EVENTS: Record<EventType, EventRecordType> = {
    gameStart: {
      listeners: {},
    },
    gameEnd: {
      listeners: {},
    },
    userMove: {
      listeners: {},
    },
    userStartMove: {
      listeners: {},
    },
    userEndMove: {
      listeners: {},
    },
    nextTurn: {
      listeners: {},
    },
    userOnGameObject: {
      listeners: {},
    },
  };

  static fire = (event: EventType, payload?: EventPayloadType) => {
    Object.values(GameEvent.EVENTS[event].listeners).forEach((callback) =>
      callback({ type: event, ...payload })
    );
  };

  static addListener = (
    event: EventType,
    callback: EventListenerCallbackType
  ) => {
    const id = GameEvent.lastListenerId++;
    GameEvent.EVENTS[event].listeners[id] = callback;
    return id;
  };

  static removeListener = (removableId: number) => {
    Object.values(GameEvent.EVENTS).forEach(({ listeners }) => {
      delete listeners[removableId];
    });
  };
}
