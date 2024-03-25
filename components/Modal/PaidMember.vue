<script setup lang="ts">
const router = useRouter()

const gotoAccountSetting = () => {
  router.push('/account-settings')
}

onBeforeRouteLeave((to, from, next) => {
  document.getElementsByTagName('body')[0].style.overflow = 'unset'
  next()
})
</script>

<template>
  <div id="modalPaid" class="modal">
    <div class="modal-body text-center mx-auto">
      <p class="desc text-18px leading-normal">
        {{ $t('components.modal_paid_member.desc') }}
      </p>
      <div class="action mt-32px mx-auto w-400px <tablet:w-full">
        <Button
          :label="$t('components.modal_paid_member.btn')"
          :size="`large`"
          @click="gotoAccountSetting"
        ></Button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  &-body {
    border-radius: 2px;
    box-shadow: 4px 4px 10px 0px #00000040;
    padding: 72px 20px;
    background-color: $color_white;
    width: 643px;
  }

  @include mq_down(sp) {
    margin: 0 15px;
  }
}

:deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>
