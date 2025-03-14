<script>
import { h } from 'vue'

const AvailableNetworks = {
  baidu: 'http://cang.baidu.com/do/add?iu=@u&it=@t',
  buffer: 'https://bufferapp.com/add?text=@t&url=@u',
  email: 'mailto:?subject=@t&body=@u%0D%0A@d',
  evernote: 'https://www.evernote.com/clip.action?url=@u&title=@t',
  facebook: 'https://www.facebook.com/sharer/sharer.php?u=@u&title=@t&description=@d&quote=@q&hashtag=@h',
  flipboard: 'https://share.flipboard.com/bookmarklet/popout?v=2&url=@u&title=@t',
  hackernews: 'https://news.ycombinator.com/submitlink?u=@u&t=@t',
  instapaper: 'http://www.instapaper.com/edit?url=@u&title=@t&description=@d',
  line: 'http://line.me/R/msg/text/?@t%0D%0A@u%0D%0A@d',
  linkedin: 'https://www.linkedin.com/shareArticle?url=@u',
  messenger: 'fb-messenger://share/?link=@u',
  odnoklassniki: 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=@u&st.comments=@t',
  pinterest: 'https://pinterest.com/pin/create/button/?url=@u&media=@m&description=@t',
  pocket: 'https://getpocket.com/save?url=@u&title=@t',
  quora: 'https://www.quora.com/share?url=@u&title=@t',
  reddit: 'https://www.reddit.com/submit?url=@u&title=@t',
  skype: 'https://web.skype.com/share?url=@t%0D%0A@u%0D%0A@d',
  sms: 'sms:?body=@t%0D%0A@u%0D%0A@d',
  stumbleupon: 'https://www.stumbleupon.com/submit?url=@u&title=@t',
  telegram: 'https://t.me/share/url?url=@u&text=@t%0D%0A@d',
  tumblr: 'https://www.tumblr.com/share/link?url=@u&name=@t&description=@d',
  twitter: 'https://twitter.com/intent/tweet?text=@t&url=@u&hashtags=@h@tu',
  viber: 'viber://forward?text=@t%0D%0A@u%0D%0A@d',
  vk: 'https://vk.com/share.php?url=@u&title=@t&description=@d&image=@m&noparse=true',
  weibo: 'http://service.weibo.com/share/share.php?url=@u&title=@t&pic=@m',
  whatsapp: 'https://api.whatsapp.com/send?text=@t%0D%0A@u%0D%0A@d',
  wordpress: 'https://wordpress.com/press-this.php?u=@u&t=@t&s=@d&i=@m',
  xing: 'https://www.xing.com/social/share/spi?op=share&url=@u&title=@t',
  yammer: 'https://www.yammer.com/messages/new?login=true&status=@t%0D%0A@u%0D%0A@d',
}

export default {
  name: 'ShareNetwork',

  props: {
    /**
     * Name of the network to display.
     */
    network: {
      type: String,
      required: true,
    },

    /**
     * URL of the content to share.
     */
    url: {
      type: String,
      required: true,
    },

    /**
     * Title of the content to share.
     */
    title: {
      type: String,
      required: true,
    },

    /**
     * Description of the content to share.
     */
    description: {
      type: String,
      default: '',
    },

    /**
     * Quote content, used for Facebook.
     */
    quote: {
      type: String,
      default: '',
    },

    /**
     * Hashtags, used for Twitter and Facebook.
     */
    hashtags: {
      type: String,
      default: '',
    },

    /**
     * Twitter user, used for Twitter
     * @var string
     */
    twitterUser: {
      type: String,
      default: '',
    },

    /**
     * Media to share, used for Pinterest
     */
    media: {
      type: String,
      default: '',
    },

    /**
     * HTML tag used by the Network component.
     */
    tag: {
      type: String,
      default: 'a',
    },

    /**
     * Properties to configure the popup window.
     */
    popup: {
      type: Object,
      default: () => ({
        width: 626,
        height: 436,
      }),
    },

    options: {
      type: Object,
      default: () => ({
        networks: null,
      }),
    },
  },

  data() {
    return {
      popupTop: 0,
      popupLeft: 0,
      popupWindow: undefined,
      popupInterval: null,
    }
  },

  computed: {
    /**
     * List of available networks
     */
    networks() {
      return Object.assign(AvailableNetworks, this.options.networks || {})
    },

    /**
     * Formatted network name.
     */
    key() {
      return this.network.toLowerCase()
    },

    /**
     * Network sharing raw sharing link.
     */
    rawLink() {
      const ua = navigator.userAgent.toLowerCase()

      /**
       * On IOS, SMS sharing link need a special formatting
       * Source: https://weblog.west-wind.com/posts/2013/Oct/09/Prefilling-an-SMS-on-Mobile-Devices-with-the-sms-Uri-Scheme#Body-only
       */
      if (this.key === 'sms' && (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1)) {
        return this.networks[this.key].replace(':?', ':&')
      }

      return this.networks[this.key]
    },

    /**
     * Create the url for sharing.
     */
    shareLink() {
      let link = this.rawLink

      /**
       * Twitter sharing shouldn't include empty parameter
       * Source: https://github.com/nicolasbeauvais/vue-social-sharing/issues/143
       */
      if (this.key === 'twitter') {
        if (!this.hashtags.length) link = link.replace('&hashtags=@h', '')
        if (!this.twitterUser.length) link = link.replace('@tu', '')
      }

      return link
        .replace(/@tu/g, '&via=' + encodeURIComponent(this.twitterUser))
        .replace(/@u/g, encodeURIComponent(this.url))
        .replace(/@t/g, encodeURIComponent(this.title))
        .replace(/@d/g, encodeURIComponent(this.description))
        .replace(/@q/g, encodeURIComponent(this.quote))
        .replace(/@h/g, this.encodedHashtags)
        .replace(/@m/g, encodeURIComponent(this.media))
    },

    /**
     * Encoded hashtags for the current social network.
     */
    encodedHashtags() {
      if (this.key === 'facebook' && this.hashtags.length) {
        return '%23' + this.hashtags.split(',')[0]
      }

      return this.hashtags
    },
  },

  render: function() {
    if (!this.networks.hasOwnProperty(this.key)) {
      throw new Error('Network ' + this.key + ' does not exist')
    }

    const node = {
      class: 'share-network-' + this.key,
      onclick: () => {
        return this[this.rawLink.substring(0, 4) === 'http' ? 'share' : 'touch']()
      },
    }

    if (this.tag === 'a') {
      node.href = 'javascript:void(0)'
    }

    return h(this.tag, node, typeof this.$slots.default === 'function' ? this.$slots.default() : null)
  },

  methods: {
    /**
     * Center the popup on multi-screens
     * http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen/32261263
     */
    resizePopup() {


      const width = window.innerWidth || (document.documentElement.clientWidth || window.screenX)
      const height = window.innerHeight || (document.documentElement.clientHeight || window.screenY)
      const systemZoom = width / window.screen.availWidth

      this.popupLeft = (width - this.popup.width) / 2 / systemZoom + (window.screenLeft !== undefined ? window.screenLeft : window.screenX)
      this.popupTop = (height - this.popup.height) / 2 / systemZoom + (window.screenTop !== undefined ? window.screenTop : window.screenY)
    },

    /**
     * Shares URL in specified network.
     */
    share() {
      this.resizePopup()

      // // If a popup window already exist, we close it and trigger a change event.
      // if (this.popupWindow && this.popupInterval) {
      //   clearInterval(this.popupInterval)
      //
      //   // Force close (for Facebook)
      //   this.popupWindow.close()
      //
      //   this.emit('change')
      // }

      window.open(
        this.shareLink,
        'sharer-' + this.key,
        ',height=' + this.popup.height +
        ',width=' + this.popup.width +
        ',left=' + this.popupLeft +
        ',top=' + this.popupTop +
        ',screenX=' + this.popupLeft +
        ',screenY=' + this.popupTop,
      )

      // // If popup are prevented (AdBlocker, Mobile App context..), popup.window stays undefined and we can't display it
      // if (!this.popupWindow) return
      //
      // this.popupWindow.focus()

      // Create an interval to detect popup closing event

      // this.popupInterval = setInterval(() => {
      //   if (!this?.popupWindow || this?.popupWindow?.closed) {
      //     clearInterval(this.popupInterval)
      //
      //     this.popupWindow = null
      //
      //     this.emit('close')
      //   }
      // }, 500)

      this.emit('open')
    },

    /**
     * Touches network and emits click event.
     */
    touch() {
      window.open(this.shareLink, '_blank')

      this.emit('open')
    },

    emit(name) {
      this.$root.$emit('share_network_' + name, this.key, this.url)
      this.$emit(name, this.key, this.url)
    },
  },
}
</script>
