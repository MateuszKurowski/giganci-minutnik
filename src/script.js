function startTimer() {
	if (!timerInterval && totalSeconds > 0) {
		timerInterval = setInterval(updateTimer, 1000)
		var startButton = document.getElementById('startBtn')
		var stopButton = document.getElementById('stopBtn')
		startButton.disabled = true
		stopButton.disabled = false
	}
}

function stopTimer() {
	if (timerInterval) {
		clearInterval(timerInterval)
		timerInterval = null
		var startButton = document.getElementById('startBtn')
		var stopButton = document.getElementById('stopBtn')
		startButton.disabled = false
		stopButton.disabled = true
	}
}

function updateTimerText() {
	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = totalSeconds % 60

	const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
	document.getElementById('timer').innerText = formattedTime
}

function padZero(value) {
	return value < 10 ? `0${value}` : value
}

function updateProgressBar() {
	const progressBar = document.getElementById('progress-bar')
	const progressPercentage = ((startTime - totalSeconds) / startTime) * 100
	progressBar.style.width = progressPercentage + '%'

	progressBar.classList.add('animate-progress')
}

function updateTimer() {
	if (totalSeconds > 0) {
		totalSeconds--
		updateTimerText()
		updateProgressBar()
	} else {
		playAudio()
		stopTimer()
		showModalMessage()
	}
}

function openModal() {
	var hours = Math.floor(totalSeconds / 3600)
	var minutes = Math.floor((totalSeconds % 3600) / 60)
	var seconds = totalSeconds % 60

	var hoursSelect = document.getElementById('hoursInput')
	var minutesSelect = document.getElementById('minutesInput')
	var secondsSelect = document.getElementById('secondsInput')

	setOptionByValue(hoursSelect, hours)
	setOptionByValue(minutesSelect, minutes)
	setOptionByValue(secondsSelect, seconds)

	document.getElementById('modal').style.display = 'block'
}

function setOptionByValue(selectElement, value) {
	var option = selectElement.querySelector('option[value="' + value + '"]')
	if (option) {
		option.selected = true
	}
}

function closeModal() {
	document.getElementById('modal').style.display = 'none'
}

function editTime() {
	stopTimer()
	const editedHours = parseInt(document.getElementById('hoursInput').value, 10)
	const editedMinutes = parseInt(document.getElementById('minutesInput').value, 10)
	const editedSeconds = parseInt(document.getElementById('secondsInput').value, 10)

	totalSeconds = editedHours * 60 * 60
	totalSeconds += editedMinutes * 60
	totalSeconds += editedSeconds
	startTime = totalSeconds
	updateTimerText()
	updateProgressBar()
	closeModal()
}

function increaseValue(selectId) {
	var selectElement = document.getElementById(selectId)
	var currentValue = parseInt(selectElement.value, 10)
	var maxValue = parseInt(selectElement.options[selectElement.options.length - 1].value, 10)

	if (currentValue < maxValue) {
		selectElement.value = currentValue + 1
	}
}

function decreaseValue(selectId) {
	var selectElement = document.getElementById(selectId)
	var currentValue = parseInt(selectElement.value, 10)
	var minValue = parseInt(selectElement.options[0].value, 10)

	if (currentValue > minValue) {
		selectElement.value = currentValue - 1
	}
}

function populateSelects() {
	populateSelect('hoursInput', 24)
	populateSelect('minutesInput', 60)
	populateSelect('secondsInput', 60)
}

function populateSelect(id, max) {
	const select = document.getElementById(id)
	for (let i = 0; i <= max; i++) {
		const option = document.createElement('option')
		option.value = i
		option.text = `${i}`
		select.add(option)
	}
}

const audio = document.getElementById('audio')

function playAudio() {
	if (audio.paused) {
		audio.play()
	}
}

function stopAudio() {
	audio.pause()
	audio.currentTime = 0
}

function showModalMessage() {
	const availableImages = ['1.png', '2.png', '3.png', '4.jpg', '5.png', '6.jpg']
	const randomIndex = Math.floor(Math.random() * availableImages.length)

	const randomImage = availableImages[randomIndex]

	Swal.fire({
		title: 'Koniec przerwy!',
		html: `<p>Wracamy do programowania 🖥️🤖</p><img src="img/${randomImage}" alt="Koniec przerwy">`,
		icon: 'warning',
		iconColor: '#ff6424',
		text: 'Wracamy do programowania.',
		confirmButtonText: 'Kodujemy!',
		backdrop: `
			rgba(0,0,123,0.4)
			url("src/giphy.gif")
			left bottom
			repeat-x
		`,
	}).then(result => {
		if (result.isConfirmed) {
			handleAcceptMessage()
		}
	})
}

function handleAcceptMessage() {
	stopAudio()
	totalSeconds = startTime
	updateTimerText()
	updateProgressBar()
}

document.getElementById('startBtn').addEventListener('click', startTimer)
document.getElementById('stopBtn').addEventListener('click', stopTimer)
document.getElementById('editTimeBtn').addEventListener('click', openModal)
document.addEventListener('DOMContentLoaded', populateSelects)

let timerInterval
let startTime = 5 * 60
let totalSeconds = startTime
updateTimerText()
