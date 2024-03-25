<script setup lang="ts">
import { useUser } from '@/stores/user'
import { useVideo } from '@/stores/video'
import { useChannel } from '@/stores/channel'
import { MasterSite, PlanPriceEnum } from '@/constants/common'
import { comma } from '@/helper/number'
import { INotification } from '@/interfaces/common'

const userStore = useUser()

const videoStore = useVideo()

const channelStore = useChannel()

const modelPayment = ref<boolean>(false)

const handleChangePlan = async (planId: number) => {
  modelPayment.value = false
  try {
    setLoading(true)
    // console.log(keywords)

    const params = {
      plan_id: planId,
    }

    const { $api } = useNuxtApp()

    const res = await $api.user.changePlan(params)

    // console.log(res)

    if (res && res.data) {
      window.location.href = res?.data?.url
      // await videoStore.$reset()
      // await channelStore.$reset()
      // await userStore.setPlanUser(res.data)
      setLoading(false)
    }
  } catch (error: any) {
    setLoading(false)
    const params = {
      description: error?._data?.message,
      duration: 4.5,
      icon: true,
      status: false,
    }

    showNotification(params as INotification)
    // throw { message: error }
  }
}

const { isPlanFree, isPlanTeam, isPlanPersonal, setLoading, showNotification } =
  useHelper()

const planName = computed(() => userStore.userData?.plan.name)
</script>

<template>
  <div class="payment pb-74px relative">
    <p class="payment-title text-16px pt-9px mb-12px">
      {{ $t('pages.payment.title') }}
    </p>
    <p class="payment-subTitle pb-40px text-16px">
      <span class="payment-subTitle__label">
        {{ $t('pages.payment.subTitle_label') }}
      </span>
      {{ $t('pages.payment.subTitle') }}
    </p>
    <div class="payment-list">
      <div class="payment-item" :class="{ hight: isPlanFree }">
        <div class="payment-plan">
          <img :src="MasterSite.plan_free" alt="" />
          <div class="payment-plan__title mt-18px mb-10px">
            {{ $t('pages.payment.title_free') }}
          </div>
          <div class="payment-plan__price mb-18px">
            <span class="text-20px"> {{ $t('pages.payment.price') }} </span>
            <span class="text-30px"> {{ PlanPriceEnum.FREE }} </span>
          </div>
          <template v-if="!isPlanFree">
            <a-popover
              :title="``"
              :get-popup-container="(triggerNode) => triggerNode.parentNode"
            >
              <template #content>
                <p>{{ $t('pages.payment.tooltip') }}</p>
              </template>
              <Button
                :disabled="isPlanFree || isPlanTeam || isPlanPersonal"
                class="w-full"
                :label="
                  isPlanFree
                    ? $t('pages.payment.btn_use_plan')
                    : $t('pages.payment.btn_change_plan')
                "
                @click="handleChangePlan(1)"
              >
              </Button>
            </a-popover>
          </template>
          <template v-else>
            <Button
              :disabled="isPlanFree || isPlanTeam || isPlanPersonal"
              class="w-full"
              :label="
                isPlanFree
                  ? $t('pages.payment.btn_use_plan')
                  : $t('pages.payment.btn_change_plan')
              "
              @click="handleChangePlan(1)"
            >
            </Button>
          </template>
          <div v-if="!isPlanFree" class="w-full text-14px mt-6px leading-tight">
            {{ $t('pages.payment.note_price_1') }}<br />
            {{ $t('pages.payment.note_price_2') }}
          </div>
        </div>
        <div class="payment-service">
          <div class="payment-service__item hide">
            <img :src="MasterSite.icon_hide" alt="" />
            <span> {{ $t('pages.payment.service_free.service_1') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_free.service_2') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_free.service_3') }}</span>
          </div>
          <div class="payment-service__item hide">
            <img :src="MasterSite.icon_hide" alt="" />
            <span>{{ $t('pages.payment.service_free.service_4') }}</span>
          </div>
          <div class="payment-service__item hide">
            <img :src="MasterSite.icon_hide" alt="" />
            <span>{{ $t('pages.payment.service_free.service_5') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_free.service_6') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_free.service_7') }}</span>
          </div>
          <div class="payment-service__item hide">
            <img :src="MasterSite.icon_hide" alt="" />
            <span>{{ $t('pages.payment.service_free.service_8') }}</span>
          </div>
          <div class="payment-service__item hide">
            <img :src="MasterSite.icon_hide" alt="" />
            <span>{{ $t('pages.payment.service_free.service_9') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_free.service_10') }}</span>
          </div>
          <div class="payment-service__item hide">
            <img :src="MasterSite.icon_hide" alt="" />
            <span>{{ $t('pages.payment.service_free.service_11') }}</span>
          </div>
        </div>
      </div>
      <div class="payment-item" :class="{ hight: isPlanPersonal }">
        <div class="payment-plan">
          <img :src="MasterSite.plan_personal" alt="" />
          <div class="payment-plan__title mt-18px mb-10px">
            {{ $t('pages.payment.title_personal') }}
          </div>
          <div class="payment-plan__price mb-10px">
            <span class="text-20px"> {{ $t('pages.payment.price') }} </span>
            <span class="text-30px"> {{ comma(PlanPriceEnum.PERSONAL) }} </span>
          </div>
          <div class="mb-18px text-16px">
            {{ $t('pages.payment.note_price') }}
          </div>
          <Button
            :disabled="isPlanPersonal"
            class="w-full"
            :label="
              isPlanPersonal
                ? $t('pages.payment.btn_use_plan')
                : $t('pages.payment.btn_change_plan')
            "
            @click="handleChangePlan(2)"
          ></Button>
          <div
            v-if="!isPlanPersonal"
            class="w-full text-14px mt-6px leading-tight"
          >
            {{ $t('pages.payment.note_price_1') }}<br />
            {{ $t('pages.payment.note_price_2') }}
          </div>
        </div>
        <div class="payment-service">
          <div class="payment-service__item hide">
            <img :src="MasterSite.icon_hide" alt="" />
            <span>{{ $t('pages.payment.service_personal.service_1') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_personal.service_2') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_personal.service_3') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_personal.service_4') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_personal.service_5') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_personal.service_6') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_personal.service_7') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_personal.service_8') }}</span>
          </div>
          <div class="payment-service__item hide">
            <img :src="MasterSite.icon_hide" alt="" />
            <span>{{ $t('pages.payment.service_personal.service_9') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_personal.service_10') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_personal.service_11') }}</span>
          </div>
        </div>
      </div>
      <div class="payment-item" :class="{ hight: isPlanTeam }">
        <div class="payment-plan">
          <img :src="MasterSite.plan_team" alt="" />
          <div class="payment-plan__title mt-18px mb-10px">
            {{ $t('pages.payment.title_team') }}
          </div>
          <div class="payment-plan__price mb-10px">
            <span class="text-20px"> {{ $t('pages.payment.price') }} </span>
            <span class="text-30px"> {{ comma(PlanPriceEnum.TEAM) }} </span>
          </div>
          <div class="mb-18px text-16px">
            {{ $t('pages.payment.note_price') }}
          </div>
          <Button
            :disabled="isPlanTeam"
            class="w-full"
            :label="
              isPlanTeam
                ? $t('pages.payment.btn_use_plan')
                : $t('pages.payment.btn_change_plan')
            "
            @click="handleChangePlan(3)"
          ></Button>
          <div v-if="!isPlanTeam" class="w-full text-14px mt-6px leading-tight">
            {{ $t('pages.payment.note_price_1') }}<br />
            {{ $t('pages.payment.note_price_2') }}
          </div>
        </div>
        <div class="payment-service">
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_team.service_1') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_team.service_2') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_team.service_3') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_team.service_4') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_team.service_5') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_team.service_6') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_team.service_7') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_team.service_8') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_team.service_9') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_team.service_10') }}</span>
          </div>
          <div class="payment-service__item">
            <img :src="MasterSite.icon_show" alt="" />
            <span>{{ $t('pages.payment.service_team.service_11') }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="payment-plan mt-14px">
      <h2 class="payment-plan_name text-20px font-bold">{{ planName }}</h2>
      <p class="payment-plan_desc pt-52px text-16px">
        {{ $t('pages.payment.desc_payment') }}
      </p>
      <div class="payment-plan_action mt-242px <tablet:mt-150px">
        <Button
          :label="$t('pages.payment.btn_payment')"
          :size="`large`"
          class="w-400px <tablet:w-full"
          @click="() => (modelPayment = true)"
        ></Button>
      </div>
      <p class="payment-plan_note pt-8px">
        {{ $t('pages.payment.note_payment') }}
      </p>
    </div>
    <ModalPlan v-model="modelPayment" :title="``">
      <p class="text-16px leading-normal">
        これはテストバージョンであり、以下の3つのオプションから1つを選んでプランを変更できます。本番環境への展開時には、Stripeと連携して支払いが行われます。
      </p>

      <div class="mt-40px flex gap-x-15px justify-between">
        <Button
          :disabled="isPlanFree"
          :label="`Free`"
          class="w-150px"
          @click="handleChangePlan(1)"
        ></Button>
        <Button
          :disabled="isPlanPersonal"
          :label="`Personal`"
          class="w-150px"
          @click="handleChangePlan(2)"
        ></Button>
        <Button
          :disabled="isPlanTeam"
          :label="`Team`"
          class="w-150px"
          @click="handleChangePlan(3)"
        ></Button>
      </div>
    </ModalPlan> -->
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-form-item) {
  margin-bottom: 0;
}

.payment {
  &-subTitle {
    border-bottom: 1px solid $color_gray1;

    @include mq_down(sp) {
      line-height: 24px;
    }

    &__label {
      background: $color_yellow5;
      color: $color_white;
      padding: 0px 6px;
      margin-right: 4px;
      border-radius: 6px;
      font-weight: 700;
    }
  }

  &-item {
    display: flex;
    align-items: flex-start;
    padding: 28px 0;
    border-bottom: 1px solid $color_gray1;

    @include mq_down(sp) {
      flex-direction: column;
    }

    &.hight {
      .payment-plan {
        background-color: $color_yellow4;

        @include mq_down(sp) {
          margin-bottom: 20px;
        }
      }

      :deep(.ant-btn) {
        background-color: $color_white;
        color: $color_black2;
        border-color: $color_white;
      }
    }
  }

  &-plan {
    width: 305px;
    padding: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-right: 53px;

    @include mq_down(sp) {
      margin-right: unset;
      width: 100%;
    }

    &__title {
      font-size: 22px;
      font-weight: bold;
    }

    &__price {
      font-size: 22px;
      font-weight: bold;
    }
  }

  &-service {
    &__item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      img {
        margin-right: 9px;
      }

      span {
        font-size: 16px;
      }

      &.hide {
        span {
          color: $color_gray2;
        }
      }
    }
  }
}

:deep(.ant-popover) {
  max-width: 236px;

  .ant-popover-inner {
    padding: 0;
  }

  .ant-popover-title {
    padding: 5px 16px;
    margin-bottom: 0;
    border-bottom: 1px solid $color_gray1;
  }

  .ant-popover-inner-content {
    padding: 12px 16px;
    font-size: 14px;
    line-height: 22px;
  }
}
</style>
