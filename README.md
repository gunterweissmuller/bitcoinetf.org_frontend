## Dependencies

* Node LTS (v18.17.1) | [NVM](https://github.com/nvm-sh/nvm)
* pnpm 8.7.0
* `Corepack enable` - npm command for enable PNPM

## Quick Start

* Мы используем `pnpm` как пакетный менеджер.
* Склонируйте репозиторий на свой компьютер
* Установите зависимости `pnpm install`
* Выполните `pnpm dev` чтобы запустить DEV сервер

## Notes

### Styles

Глобальные стили проекта (переменные, миксины и прочее) вы можете добавить в структуре:

```plain
./src/app/styles/global.scss
```

### Использование rem, вместо px в стилях

Вместо px, используем функцию rem, которая принимает N аргументов.
Примеры:

```scss
padding-top: torem(20);
padding: torem(24, 0, 16, 24);
```

### Использование медиа запросов в стилях

Используем миксин breakpoint, который принимает N аргументов следующих видов:

* max-width 340
* min-width 340, max-width 1200, pointer fine, ...+N

Так же принимает одну переменную с N аргументов:

```scss
$width-desktop-range: min-width 340, max-width 1200, pointer fine, ...+N
```

Пиксели не указываются.

Примеры:

```scss
$break-tablet-range: min-width 768, max-width 991, pointer fine;
@include breakpoint($break-tablet-range) { content }
@include breakpoint(max-width 991) { content }
@include breakpoint(min-width 340, max-width 991, pointer fine) { content }
```

Основные брейкпоинты находятся в sass/tools/layout.scss.

### Использование Адаптера http запросов

В адаптере реализованы готовые 4 метода для использования:

```ts
getTextAsync(_payload: IWrapperRequestAsync): Promise<string> // после получения респонса возвращает response.text()
requestBlobAsync(_payload: IWrapperRequestAsync): Promise<ArrayBuffer> // после получения респонса возвращает response.blob()
requestJsonAsync<T>(_payload: IWrapperRequestAsync): Promise<T> // после получения респонса возвращает response.json()
requestIgnoreResponseDataAsync(_payload: IWrapperRequestAsync): Promise<null> // возвращает Promise.resolve(null), используем если нам не нужен респонс с бекенда, только сам факт успешного запроса
```

### useNotification

Композабл который позволяет при вызове метода

```js
addNotification({
  text: 'test',
  type: SnackbarTypes.SUCCESS, // default | success | error
  link: { 
    text: 'Настроить', 
    to: {
      name: 'profile-notifications',
    },
  },
  icon: Icon.MonoOtherNotification,
})
```
показать уведомление о каком либо действии,
так же можно передать timeoutToHide, чтобы указать через сколько времени скрыть уведомление ( по дефолту скрывается через 10 секунд).
Type, link и icon не обязательные параметры.



## Описание приложения по страницам

### Страницы аналитики

#### Performance - personal/analytics/performance

Выводится информация по асетам фонда. 
При клике на один из асетов ведет на страницу конкретного асета.
Так же на странице выводится блок с последними сделками. 
При клике на View all ведет на страницу со всеми сделками.
Вся информация обновляется по WebSocet
Так же на странице выводится блок с новостями.

#### Portfolio - personal/analytics/portfolio

Выводится информация по асетам фонда.
При клике на один из асетов ведет на страницу конкретного асета.
Так же на странице выводится блок с последней активностью фонда.
При клике на View all ведет на страницу со всеми активностями фонда.
Вся информация обновляется по WebSocet
Так же на странице выводится блок с новостями.

#### Fund - personal/analytics/fund

Выводится информация по асетам фонда.
На графике реализована фильтрация по разным периодам времени (7 дней, 1 месяц, 6 месяцев, 1 год, За все время)
Так же на странице выводятся блоки с дополнительной информацией по фонду, топ акционеров, последними покупками. 
По клику на View all на блоках топ акционеров и последние покупки можно перейти на страницу содержащую информацию по ним.
Если кликнуть на конкретную покупку отобразится диалог с дополнительной информацией о покупке.
Так же на странице выводится блок с новостями.

### Страница персонального заработка. - personal/earnings

На первом графике отображается заработок прогнозируемый на несколько лет вперед с помощью 3х показателей: Projected, Guaranteed, Actual apy.
На втором графике отображается информация о выплаченных дивидендов а так же в зависимости от apy.
Так же выводится персонализированная информация о заработках.
В блоке statements выводятся отчеты по заработкам. При клике на любое место мы перейдем на страницу с отчетами. 
При клике на отчет скачается pdf файл с отчетом за месяц.

### Страница кошелька.

#### Dividends - personal/wallet/dividends

Выводится информация о выплаченных дивидендах.
Так же можно добавить методы для вывода денег. 

#### Referrals - personal/wallet/referrals

Выводится информация о выплаченных бонусов по реферальной системе.

#### Bonus - personal/wallet/bonus

Выводится информация о выплаченных бонусах.

### Страница еще - personal/more.

Выводятся дополнительные страницы которые есть в приложение.
При клике на Apply for credit card - выводится диалог с информации о регистарции на получение карты
Bitcoin education, Blog, Purchase agreement, Support - ведут на лендинг


Refer Friends, Get 5% Forever! 💸
Tell friends about BitcoinETF. You get 5% of what they buy, always. They get better rates too


#### Страница персональных данных - personal/more/personal-details

Выводится информация об аккаунте.

#### Страница отображение валюты - personal/more/display-currency

Выводится механизм по которому меняется отображение валюты на сайте.

#### Страница сброса пароля - personal/more/change-pass

На странице есть возможность сброса пароля

#### Страница смены темы сайта - personal/more/theme

На странице есть возможность смены темы













