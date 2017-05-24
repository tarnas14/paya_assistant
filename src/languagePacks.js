const polishFemaleVoiceNumeral = number => [
  'zero',
  'jedna',
  'dwie',
][number]

export default [
  {
    predicate: lang => lang === 'pl-PL',
    commands: {
      payments: 'płatności',
      whatIsTheMeaningOfLife: 'jaki jest sens życia',
      pay: 'zapłać',
      skip: 'dalej',
      yes: 'tak proszę',
      onlyList: 'tylko wylistuj',
      noThankYou: 'nie dziękuję',
    },
    lines: {
      toSummarize: () => 'Podsumowując',
      theMeaningOfLife: () => 'Czasem podczas pitcha nie włączą prezentacji, ale nie ma co się przejmować jeśli dobrze się bawiliście',
      noIsNo: () => 'Nie to nie',
      listingPayments: () => 'Listuję płatności.',
      noPendingPayments: () => 'Nie masz żadnych zaległych płatności.',
      availableCommands: () => 'Dostępne komendy to:',
      and: () => 'oraz',
      tryAgain: () => 'Spróbuj ponownie',
      greeting: name => `Witaj, ${name}`,
      howCanIHelpYou: () => 'W czym mogę Ci pomóc?',
      couldNotCatchThat: () => 'Nie dosłyszałam. Sprawdź czy masz włączony mikrofon.',
      unknownCommand: hit => `Nie rozpoznałam komendy '${hit}'.`,
      howElseCanIHelpYou: () => 'W czym jeszcze mogę Ci pomóc?',
      ifYouReallyMustKnow: () => 'Jeśli już koniecznie chcesz wiedzieć.',
      noProblem: () => 'Dzięki za hakaton, było super. ;)',
      pendingPaymentsNumeral: count => {
        const map = ['jedną zaległą płatność', 'dwie zaległe płatności', 'trzy zaległe płatności',
            'cztery zaległe płatności', 'pięć zaległych płatności', 'sześć zaległych płatności', 'siedem zaległych płatności', 'osiem zaległych płatności', 'dziewięć zaległych płatności', 'dziesięć zaległych płatności']

        return map[count - 1]
      },
      youHavePayments: pending => `Masz ${pending}. Chcesz się nimi teraz zająć?`,
      paymentDescription: payment => `${payment.name}. ${payment.amount}zł`,
      paying: name => `Opłacam ${name}`,
      considerItDone: () => 'Załatwione',
      skipping: name => `Pomijam ${name}`,
      thatWasTheLastOne: () => 'To była ostatnia płatność na liście',
      paid: count => `Uregulowane płatności: ${polishFemaleVoiceNumeral(count)}`,
      skipped: count => `Płatności pominięte: ${polishFemaleVoiceNumeral(count)}`,
      thatsAll: name => 'To by było na tyle'
    }
  },
  {
    predicate: () => true,
    commands: {
      payments: 'payments',
      whatIsTheMeaningOfLife: 'what is the meaning of life',
      pay: 'payment',
      skip: 'skip please',
      yes: 'yes please',
      onlyList: 'just list',
      noThankYou: 'no thank you',
    },
    lines: {
      toSummarize: () => 'Summarizing,',
      theMeaningOfLife: () => 'The meaning of life is: 42',
      noIsNo: () => 'Whatever, then',
      listingPayments: () => 'Listing payments.',
      noPendingPayments: () => 'You have no pending payments.',
      availableCommands: () => 'Available commands are:',
      and: () => 'and',
      tryAgain: () => 'Try again',
      greeting: name => `Hello, ${name}`,
      howCanIHelpYou: () => 'How may I help you?',
      couldNotCatchThat: () => 'I did not catch that. Check if your mic is plugged in.',
      unknownCommand: hit => `Unknown command '${hit}'`,
      howElseCanIHelpYou: () => 'How else may I help you?',
      ifYouReallyMustKnow: () => 'If you really insist.',
      noProblem: () => 'You are welcome ;)',
      pendingPaymentsNumeral: count => {
        if (count === 1) {
          return '1 pending payment'
        }

        return `${count} pending payments`
      },
      youHavePayments: pending => `You have ${pending}. Do you want to take care of them now?`,
      paymentDescription: payment => `${payment.name}. ${payment.amount}zł`,
      paying: name => `Paying ${name}`,
      considerItDone: () => 'Done and done',
      skipping: name => `Skipping ${name}`,
      thatWasTheLastOne: () => 'That was the last one',
      paid: count => `We took care of ${count} payments`,
      skipped: count => `${count} left for the next time`,
      thatsAll: name => `That is all, folks`
    }
  },
]
