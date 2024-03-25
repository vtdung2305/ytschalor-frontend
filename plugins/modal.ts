import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'
import { Modal } from 'ant-design-vue'
import { IModalParams } from '@/interfaces/common'

export default defineNuxtPlugin((context) => {
  const modalConfirm = async (modal: IModalParams) => {
    return await new Promise((resolve, reject) => {
      Modal.confirm({
        title: modal.title || null,
        icon: createVNode(ExclamationCircleOutlined),
        content: modal.content || null,
        okText: modal.okText || null,
        okType: 'primary',
        cancelText: modal.cancelText || null,
        async onOk() {
          const result = await new Promise((resolve, reject) => {
            setTimeout(() => resolve(true), 1000)
          })

          resolve(result)
        },
        onCancel() {
          resolve(false)
        },
        class: 'modalConfirm',
        getContainer: document.getElementById('modalConfirm'),
      })
    })
  }

  const modalWarning = async (modal: IModalParams) => {
    return await new Promise((resolve, reject) => {
      Modal.warning({
        title: modal.title || null,
        icon: createVNode(ExclamationCircleOutlined),
        content: modal.content || null,
        okText: modal.okText || null,
        okType: 'primary',
        cancelText: modal.cancelText || null,
        onOk() {
          resolve(true)
        },
        class: 'modalConfirm',
      })
    })
  }

  const modalSuccess = async (modal: IModalParams) => {
    return await new Promise((resolve, reject) => {
      Modal.success({
        title: modal.title || null,
        icon: createVNode(ExclamationCircleOutlined),
        content: modal.content || null,
        okText: modal.okText || null,
        okType: 'primary',
        cancelText: modal.cancelText || null,
        onOk() {
          resolve(true)
        },
        onCancel() {
          resolve(false)
        },
        class: 'modalConfirm',
      })
    })
  }

  const modalInfo = async (modal: IModalParams) => {
    return await new Promise((resolve, reject) => {
      Modal.info({
        title: modal.title || null,
        icon: createVNode(ExclamationCircleOutlined),
        content: modal.content || null,
        okText: modal.okText || null,
        okType: 'primary',
        cancelText: modal.cancelText || null,
        onOk() {
          resolve(true)
        },
        onCancel() {
          resolve(false)
        },
        class: 'modalConfirm',
      })
    })
  }

  const modalError = async (modal: IModalParams) => {
    return await new Promise((resolve, reject) => {
      Modal.error({
        title: modal.title || null,
        icon: createVNode(ExclamationCircleOutlined),
        content: modal.content || null,
        okText: modal.okText || null,
        okType: 'primary',
        cancelText: modal.cancelText || null,
        onOk() {
          resolve(true)
        },
        onCancel() {
          resolve(false)
        },
        class: 'modalConfirm',
      })
    })
  }

  return {
    provide: {
      modalConfirm,
      modalWarning,
      modalInfo,
      modalSuccess,
      modalError,
    },
  }
})
