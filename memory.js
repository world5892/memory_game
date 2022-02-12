// ITEM CONTROLLER ***********
const ItemCtrl = (function () {

  const getCards = function () {
    let fields = [];

    for (counter1 = 0; counter1 < 2; counter1++) {
      for (counter2 = 0; counter2 < 6; counter2++) {
        fields.push(`url(img/c${counter2}.png) center center no-repeat`);
      }
    }

    return fields;
  }

  const shuffleArray = function () {
    const array = getCards();

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  const data = {
    cards: shuffleArray(),
    numberOfCards: 6,
    numberOfClickedCards: 0,
    firstClickedCard: null,
    secondClickedCard: null,
    firstClickedCardId: null,
    secondClickedCardId: null,
    attempts: 0,
    numberOfGuessedPairs: 0
  };

  // Public methods
  return {
    data
  };
})();


// UI CONTROLLER ***********
const UICtrl = (function () {
  const selectors = {
    flexContainer: '.flex-container',
    cards: '.card',
    counter: '.counter',
    attempts: '.attempts'
  };

  // Public methods
  return {
    selectors,

    showClickedCard: function (cardsArr, card, id) {
      card.style.background = cardsArr[id];
    },

    hideClickedCards: function (same, card1, card2) {
      if (same) {
        card1.style.background = 'inherit';
        card1.style.border = '5px solid transparent';
        card1.style.pointerEvents = 'none';

        card2.style.background = 'inherit';
        card2.style.border = '5px solid transparent';
        card2.style.pointerEvents = 'none';

        card1.className = 'card-guessed';
        card2.className = 'card-guessed';
      } else {
        card1.style.background = `url('img/karta.png') center center no-repeat`;

        card2.style.background = `url('img/karta.png') center center no-repeat`;
      }
    },



    blockClick: function (card) {
      card.style.pointerEvents = 'none';
    },

    unBlockClick: function (card) {
      card.style.pointerEvents = 'initial';
    },

    blockClickAll: function () {
      document.querySelectorAll(selectors.cards).forEach(card => {
        card.style.pointerEvents = 'none';
      });
    },

    unBlockClickAll: function () {
      document.querySelectorAll(selectors.cards).forEach(card => {
        card.style.pointerEvents = 'initial';
      });
    },

    showtotalAttempts: function (attempts) {
      document.querySelector(selectors.counter).textContent = attempts;
    },

    showScore: function (attempts) {
      const html = `
        <h2>You win!</h2>
        <h2>Done in ${attempts} attempts</h2>
      `;

      document.querySelector(selectors.flexContainer).style.display = 'block';
      document.querySelector(selectors.flexContainer).innerHTML = html;

      document.querySelector(selectors.attempts).innerHTML = '';
    }
  }
})();


// APP CONTROLLER ***********
const App = (function (ItemCtrl, UICtrl) {

  const data = ItemCtrl.data;

  const selectors = UICtrl.selectors;

  const loadEventListeners = function () {
    document.querySelector(selectors.flexContainer).addEventListener('click', (e) => {
      if (e.target.classList.contains('card')) {
        data.numberOfClickedCards++;

        if (data.numberOfClickedCards === 1) {
          data.firstClickedCard = e.target;
          data.firstClickedCardId = parseInt(data.firstClickedCard.id.split('-')[1]);

          UICtrl.blockClick(data.firstClickedCard);

          UICtrl.showClickedCard(data.cards, data.firstClickedCard, data.firstClickedCardId);

        }

        if (data.numberOfClickedCards === 2) {
          data.attempts++;

          data.secondClickedCard = e.target;
          data.secondClickedCardId = parseInt(data.secondClickedCard.id.split('-')[1]);

          UICtrl.blockClickAll();

          UICtrl.showClickedCard(data.cards, data.secondClickedCard, data.secondClickedCardId);

          UICtrl.showtotalAttempts(data.attempts);

          if (data.firstClickedCard.style.background === data.secondClickedCard.style.background) {
            data.numberOfGuessedPairs++;

            if (data.numberOfGuessedPairs === data.numberOfCards) {
              UICtrl.showScore(data.attempts);
            }

            setTimeout(() => {
              UICtrl.hideClickedCards(true, data.firstClickedCard, data.secondClickedCard);

              UICtrl.unBlockClickAll();
            }, 1000);

          } else {
            setTimeout(() => {
              UICtrl.hideClickedCards(false, data.firstClickedCard, data.secondClickedCard);

              UICtrl.unBlockClick(data.firstClickedCard);
              UICtrl.unBlockClickAll();
            }, 1000);
          }

          data.numberOfClickedCards = 0;
        }
      }
    });
  };

  const init = function () {

    loadEventListeners();

    console.log(data.cards);

  };

  // Public methods
  return {
    init
  }

})(ItemCtrl, UICtrl);


App.init();