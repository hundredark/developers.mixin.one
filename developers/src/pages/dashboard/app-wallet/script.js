import WithdrawalModal from './withdrawal'
import UpdateToken from '@/components/UpdateToken'
import tools from '@/assets/js/tools'

export default {
  components: {
    WithdrawalModal, UpdateToken
  },
  props: {
    active_app: {
      type: Object,
      default() {
        return {}
      }
    },
    client: {
      type: Object
    }
  },
  data() {
    return {
      is_edited: false,
      open_edit_modal: false,
      submit_form: {
        session_id: '',
        pin_token: '',
        private_key: ''
      },
      assets_list: [],
      loading: false,
      whole_loading: false,
      show_withdrawal: false,
      active_asset: {}
    }
  },
  watch: {
    active_app(val) {
      if (this.$ls.get(val.app_id)) {
        this._get_assets_list()
      }
    }
  },
  methods: {
    close_modal() {
      this.open_edit_modal = false
    },
    click_withdrawal(item) {
      this.active_asset = item
      setTimeout(() => {
        this.show_withdrawal = true
      }, 200)
    },
    async _get_assets_list() {
      this.whole_loading = true
      let client_info = this.$ls.get(this.active_app.app_id)
      if (!client_info) {
        this.is_edited = false
        this.open_edit_modal = true
        this.whole_loading = false
        return
      }
      try {
        _vm._not_through_interceptor = true
        let res = await this.client.asset.fetchList()
        if (res) {
          this.assets_list = res.sort(tools.assetSortCompare)
          this.is_edited = true
          this.open_edit_modal = false
        } else {
          this.is_edited = false
          this.open_edit_modal = true
          this.$ls.rm(this.active_app.app_id)
        }
      } catch (e) {
        this.$message.error({ message: this.$t("message.errors.401"), showClose: true })
        this.is_edited = false
        this.open_edit_modal = true
        this.$ls.rm(this.active_app.app_id)
      } finally {
        this.whole_loading = false
        _vm._not_through_interceptor = false
      }
    },
  },
  mounted() {
    if (this.$ls.get(this.active_app.app_id)) {
      this._get_assets_list()
    }
  },
}
