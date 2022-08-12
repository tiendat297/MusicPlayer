const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThunb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playButton = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const next = $('.btn-next')
const prev = $('.btn-prev')
const random = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currentIndex: 1,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Mắt Đen - cover',
            singer: 'Đạt',
            path: './assets/music/matden.m4a',
            image: './assets/img/1482997382138_600.jpg'
        },
        {
            name: 'Bước qua mùa cô đơn',
            singer: 'Vũ',
            path: './assets/music/BuocQuaMuaCoDon-Vu-6879419.mp3',
            image: './assets/img/buocquamuacodon.jpg'
        },
        {
            name: 'Sài Gòn đau lòng quá',
            singer: 'Hứa Kim Tuyền',
            path: './assets/music/song2.mp3',
            image: './assets/img/saigondaulongqua.jpg'
        },
        {
            name: 'Mùa mưa ngâu nằm cạnh',
            singer: 'Vũ',
            path: './assets/music/muamuangaunamcanh.mp3',
            image: './assets/img/1482997382138_600.jpg'
        },
        {
            name: 'Phút ban đầu',
            singer: 'Vũ',
            path: './assets/music/PhutBanDau-ThaiVu-4269392.mp3',
            image: './assets/img/phutbandau.jpg'
        },
        {
            name: 'Đông kiếm em',
            singer: 'Vũ',
            path: './assets/music/DongKiemEm-ThaiVu-4373753.mp3',
            image: './assets/img/dongkiemem.jpg'
        },
        
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                    <div data-index="${index}" class="song ${index === this.currentIndex ? 'active' : ''}">
                        <div class="thumb" style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                `
            }
        )

        $('.playlist').innerHTML = htmls.join('')
    },
    handleEvent: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay và dừng

        const cdThumbAnimate = cdThunb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });
            cdThumbAnimate.pause();
        // Xử lý cuộn 
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi play
        playButton.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
            
            // Khi song được play
            audio.onplay = function () {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }

            // Khi song được pause
            audio.onpause = function () {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }

            // Khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function () {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                }
            }
            
        }
        // Xử lý khi next
        next.onclick = function () {
            if (_this.isRandom) {
                 _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollTopActiveSong()
            // player.classList.toggle('playing')
        }
        // Xử lý khi quay lại 
        prev.onclick = function () {
            _this.prevSong()
            audio.play()
        }
        // xử lý khi tua
        progress.onchange = function (e) {
            const progressPercent = e.target.value / 100
            audio.currentTime = progressPercent * audio.duration
        }
        // chọn random
        random.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            random.classList.toggle('active', _this.isRandom)
        }

        // Xử lý next khi ended  
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                next.click()
            }
        }

        // Xử lý reapet
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // chọn bài hát 
        playList.onclick = function (e) {
            // Xử lý khi click vào song
            if (e.target.closest('.song:not(.active)') || e.target.closest('.option')) {
                if (e.target.closest('.song:not(.active)')) {
                    _this.currentIndex = Number(e.target.closest('.song:not(.active)').dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length - 1) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollTopActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThunb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    start: function () {
        // Địng nghĩa các thuộc tính cho Object
        this.defineProperties()
        // Lắng nghe các sự kiện
        this.handleEvent()
        // Tải thông tin bài hát đầu tiên 
        this.loadCurrentSong()
        this.render()
    }
}

app.start()
