<template>
  <div class="support-page">
    <iframe src="https://secure.livechatinc.com/licence/16652127/open_chat.cgi"></iframe>
  </div>
</template>
<style lang="scss">
.support-page{
  iframe{
    width: 100%;
    height: calc(100vh - 214px);
    @include breakpoint($break-desktop-1024) {
      height: calc(100vh - 151px); // 103px topHeight + 48px by left and right padding
    }
  }
}
</style>
