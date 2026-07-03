<template>
  <section class="workspace">
    <div class="workspace__panel">
      <div class="workspace__header">
        <div>
          <p class="workspace__eyebrow">Товары</p>
          <h2 class="workspace__title">Информация о товарах</h2>
        </div>
      </div>

      <div class="workspace__body">
        <div class="workspace__row">
          <span class="workspace__label">Назначение</span>
          <span class="workspace__value">Базовые данные товаров, состав, характеристики и связи.</span>
        </div>
        <div class="workspace__row">
          <span class="workspace__label">Статус</span>
          <span class="workspace__value">Раздел подготовлен под подключение товарного API.</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.workspace {
  display: flex;
  flex-direction: column;
  gap: var(--size-300);
}

.workspace__panel {
  padding: var(--size-500);
  background: var(--clr-neutral-100);
  border: 1px solid var(--clr-neutral-400);
  border-radius: var(--radius-lg);
  box-shadow: var(--general-shadow);
}

.workspace__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: var(--size-400);
  border-bottom: 1px solid var(--clr-neutral-400);
}

.workspace__eyebrow {
  margin-bottom: var(--size-100);
  font-size: var(--fs-50);
  font-weight: var(--fw-bold);
  color: var(--clr-neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.workspace__title {
  font-family: var(--font-serif);
  font-size: var(--fs-400);
  font-weight: 600;
}

.workspace__body {
  display: flex;
  flex-direction: column;
  gap: var(--size-300);
  padding-top: var(--size-400);
}

.workspace__row {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: var(--size-300);
  align-items: start;
}

.workspace__label {
  font-size: var(--fs-100);
  font-weight: var(--fw-bold);
  color: var(--clr-neutral-700);
}

.workspace__value {
  font-size: var(--fs-100);
  color: var(--clr-neutral-600);
}

@media screen and (max-width: 768px) {
  .workspace__panel {
    padding: var(--size-300);
  }

  .workspace__row {
    grid-template-columns: 1fr;
    gap: var(--size-100);
  }
}
</style>
