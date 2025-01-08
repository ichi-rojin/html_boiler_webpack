// グローバル名前空間定義
import '../vendor/jquery-1.8.3.min'
import '../vendor/jquery.easing'
import './libs/string'
import './libs/smoothScroll'
import './libs/accordionList'
import './libs/slidePanel'
import './libs/outputAltText'
import './libs/getAbsPath'
import './libs/getParams'
import './libs/setParams'
import './libs/getBreakpoint'
import './libs/respContSize'
import './libs/scrollbar'
import metaJson from '../../meta.json'
import imagesLoadListener from './libs/imagesLoadListener'
import { TextScramble } from './libs/textScramble'
import { inviewBehavior } from './inview'
import luxy from 'luxy.js'
const jQuery = window.jQuery

window.addEventListener('DOMContentLoaded', (event) => {
  scroll(0, 500)
})

;(($) => {
  $(() => {
    imagesLoadListener(document.body, () => {
      setTimeout(() => {
        $('body').animate({ opacity: 1 }, 500, () => {
          $('body').css('opacity', '').removeClass('-loading')
        })
        $('html, body')
          .animate({ scrollTop: 0 }, 1000)
      }, 1000)
    })

    const drawerFunction = () => {
      const containerStatus = 'drawer--isOpen'
      $('.drawer-btn').on('click', function (e) {
        $('body').addClass(containerStatus)
      })
      $(`
        .drawer-close,
        .offcanvas-base
      `).on('click', (e) => {
        $('body').removeClass(containerStatus)
      })
    }
    drawerFunction()

    // スムーススクロール
    $('a[href^=#]').smoothScroll({ duration: 500 })

    const changeDrawerContents = () => {
      const $drawerInContents = $('.drawerInContents:first')
      const $drawerInFigure = $drawerInContents.find('.drawerInContents__image')
      const $drawerInImg = $drawerInFigure.find('img')
      const $drawerInHeading = $drawerInContents.find('.drawerInContents__heading')
      const $drawerInText = $drawerInContents.find('.drawerInContents__text')
      const fx1 = new TextScramble($drawerInHeading.get(0))
      const fx2 = new TextScramble($drawerInText.get(0))
      $('.drawerInNav a').on('mouseenter', function () {
        const id = $(this).data('id')
        const meta = metaJson[id]
        if (!meta) return

        $drawerInFigure.removeClass('-fade')
        setTimeout(() => {
          $drawerInImg.attr('src', meta.ogp_img)
          $drawerInFigure.addClass('-fade')
        }, 1)

        fx1.setText(meta.title)
        fx2.setText(meta.excerpt)
      })
    }
    changeDrawerContents()

    // テキストスクランブル
    const logoScramble = () => {
      const $t = $('.siteID:first')
      const $a = $t.find('a')
      const fx = new TextScramble($a.get(0))
      const text = $a.text()
      $a.on({
        mouseenter: () => {
          $a.css({
            'min-height': $a.innerHeight(),
            'min-width': $a.innerWidth()
          })
          fx.setText(text).then(() => {
            $a.css({
              'min-height': '',
              'min-width': ''
            })
          })
        },
        mouseleave: () => {
          fx.setText(text)
        }
      })
    }
    logoScramble()

    $('.drawerInNav__layer').each(function () {
      const fx = new TextScramble($(this).get(0))
      const $a = $(this).closest('a')
      const text = $(this).text()
      $a.on({
        mouseenter: () => {
          fx.setText(text)
        },
        mouseleave: () => {
          fx.setText(text)
        }
      })
    })

    $('.styleCard__footer p').each(function () {
      const fx = new TextScramble($(this).get(0))
      const $a = $(this).closest('.styleCard')
      const text = $(this).text()
      $a.on({
        mouseenter: () => {
          $(this).css('height', $(this).innerHeight())
          fx.setText(text).then(() => {
            $(this).css('height', '')
          })
        }
      })
    })

    $('.homeSectionBtn__layer').each(function () {
      const fx = new TextScramble($(this).get(0))
      const $a = $(this).closest('a')
      const text = $(this).text()
      $a.on({
        mouseenter: () => {
          fx.setText(text)
        },
        mouseleave: () => {
          fx.setText(text)
        }
      })
    })

    inviewBehavior(`
      .homeSection__heading,
      .homeSection__description,
      .homeSection__text p,
      .homeSectionBtn__layer,
      .styleCard__navigator p
    `)

    luxy.init({
      wrapper: '#parallaxStage', // 慣性スクロールを包括する要素のID
      targets: `
        .homeSection__bg,
        .homeSection__statement,
        .fpFog
      `, // パララックスの要素のclass名
      wrapperSpeed: 0.1 // スクロールスピード
    })
  })
})(jQuery)
