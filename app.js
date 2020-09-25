// TODO: Fix page reload when already scrolled
//
let RowMinHeight = 18
let NumRowsShownOnScroll = 200
let PixelDistToShowMore = 500

var numShown
var intrinsicListDiv
var filteredIntrinsics = intrinsicsData

function toggleDetails(event) {
  var detailsId = "details-" + event.target.id
  document.getElementById(detailsId).classList.toggle("hidden")
}

function searched(event) {
  var searchTerm = event.target.value.toLowerCase()

  filteredIntrinsics = intrinsicsData.filter(intrinsic => {
    return intrinsic.name.toLowerCase().includes(searchTerm)
      || intrinsic.type.toLowerCase().includes(searchTerm)
      || intrinsic.description.toLowerCase().includes(searchTerm)
  })

  intrinsicListDiv.innerHTML = ""
  numShown = 0
  showMore()

  intrinsicListDiv.style.minHeight = filteredIntrinsics.length * RowMinHeight + "px"
}

function showMore() {
    intrinsicListHTML = ""
    var newNumShown = Math.min(numShown + NumRowsShownOnScroll, filteredIntrinsics.length)
    for (; numShown < newNumShown; numShown++) {
      var intrinsic = filteredIntrinsics[numShown]
      intrinsicListHTML += intrinsic['html']
    }

    intrinsicListDiv.innerHTML += intrinsicListHTML
}

function scrolled() {
  var scrollTop = document.documentElement.scrollTop
  var scrollBottom = scrollTop + window.innerHeight

  var shownIntrinsics = document.getElementsByClassName("intrinsic")
  var lastShownIntrinsic = shownIntrinsics[shownIntrinsics.length-1]

  var lastY = lastShownIntrinsic.offsetTop

  // Check if the last elemnt is almost visible
  if (scrollBottom + PixelDistToShowMore > lastY) {
    showMore()
  }
}

function initialRender() {
  // Create the html for each intrinsic
  intrinsicsData.forEach(intrinsic => {
    html = `
      <input id="${intrinsic.name}" class="hidden" type="checkbox" oninput="toggleDetails(event)">
      <label class="intrinsic" for="${intrinsic.name}">
        <span class="code">${intrinsic.return_type}</span>
        <span class="code intrinsic-name">${intrinsic.name}</span>
        <span class="code">(${intrinsic.arg_list})</span>
        <span class="code intrinsic-type">${intrinsic.type}</span>
      </label>
      <div id="details-${intrinsic.name}" class="hidden details">
        <h2>Description</h2>
        <div class="code intrinsic-description">
          ${intrinsic.description}
        </div>
        <h2>Instruction</h2>
        <span class="code">
	  <a href="${intrinsic.instruction_ref_link}">${intrinsic.instruction_mnemonic}</a>
          ${intrinsic.instruction_operands}
        </span>
        <h2>Operation</h2>
        <pre class="code intrinsic-description">
          ${intrinsic.operation}
        </pre>
      </div>
    `
    intrinsic["html"] = html

  })

  intrinsicListDiv = document.getElementById("intrinsic-list")

  // Render first elements
  numShown = 0
  showMore()
  intrinsicListDiv.style.minHeight = filteredIntrinsics.length * RowMinHeight + "px"

  window.addEventListener("scroll", scrolled)
  document.getElementById("search").addEventListener("input", searched)
}

window.addEventListener("load", event => {
  initialRender()
})

