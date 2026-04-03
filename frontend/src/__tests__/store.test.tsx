import { boardReducer, initialState } from '../lib/store';

describe('boardReducer', () => {
  it('moves a card into another column and reorders that destination column', () => {
    const state = boardReducer(initialState, {
      type: 'MOVE_CARD',
      payload: {
        cardId: 'card-1',
        targetColumnId: 'column-3',
        targetIndex: 1,
      },
    });

    const columnCards = state.cards
      .filter((card) => card.columnId === 'column-3')
      .sort((left, right) => left.order - right.order);

    expect(columnCards.map((card) => card.id)).toEqual(['card-3', 'card-1']);
  });

  it('renames a column without changing the column count', () => {
    const state = boardReducer(initialState, {
      type: 'RENAME_COLUMN',
      payload: {
        columnId: 'column-2',
        title: 'Ready',
      },
    });

    expect(state.columns).toHaveLength(5);
    expect(state.columns.find((column) => column.id === 'column-2')?.title).toBe('Ready');
  });

  it('moves a newly created card into another column', () => {
    const addedState = boardReducer(initialState, {
      type: 'ADD_CARD',
      payload: {
        columnId: 'column-1',
        title: 'New card',
        details: 'Fresh work item.',
      },
    });

    const newCard = addedState.cards.find((card) => card.title === 'New card');
    expect(newCard).toBeDefined();

    const movedState = boardReducer(addedState, {
      type: 'MOVE_CARD',
      payload: {
        cardId: newCard!.id,
        targetColumnId: 'column-4',
        targetIndex: 1,
      },
    });

    const movedCard = movedState.cards.find((card) => card.id === newCard!.id);
    expect(movedCard?.columnId).toBe('column-4');

    const reviewCards = movedState.cards
      .filter((card) => card.columnId === 'column-4')
      .sort((left, right) => left.order - right.order);

    expect(reviewCards.map((card) => card.title)).toEqual(['Review copy tone', 'New card']);
  });
});
