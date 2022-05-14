const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")
const searchInput = document.querySelector("[data-search]")

let users = []

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase()
  users.forEach(user => {
    const isVisible =
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value)
    user.element.classList.toggle("hide", !isVisible)
  })
})

// 기본적으로 object 형태로 왔다갔다 하는것이 편함

const getSheetData = async () => {
  const sheetId = '1O1YZOzLp258fYXl6lr1ZTB7FhLMzZcvH1wIMx1zmQP0';
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
  const sheetName = 'forcards';
  const query = encodeURIComponent('Select *')
  const url = `${base}&sheet=${sheetName}&tq=${query}`

  const response = await fetch(url);
  // const data = await response.text().substring(47).slice(0, -2).json();
  data = await response.text();
  parsed = JSON.parse(data.substring(47).slice(0, -2))

  let columns = parsed.table.cols.map((col) => col.label)
  let items = parsed.table.rows.map(({ c }) => cleanRow(c))
  // .map(([name, branch, typeMid, typeSmall, address, building, lon, lat]) => ({ name, branch, typeMid, typeSmall, address, building, lon, lat }))
  l = columns.length;
  var formattedItems = [] //formatted into array of objects
  for (var i = 0; i < items.length; i++) {
    var d = items[i], o = {};
    for (var j = 0; j < l; j++) {
      o[columns[j]] = d[j];
    }
    formattedItems.push(o);
  }

  formattedItems.forEach(
    (item) => {
      const card = userCardTemplate.content.cloneNode(true).children[0]
      console.log(card)
      const image = card.querySelector("[head-image]")
      const headTitle = card.querySelector("[head-title]")

      image.src = item.finalPhotoUrl
      headTitle.textContent = item.name
      // const header = card.querySelector("[data-header]")
      const body = card.querySelector("[data-body]")
      body.textContent = item.building

      userCardContainer.append(card)
      // console.log(card)
    }
  )

  return items
};


function cleanRow(row) {
  // row = [null,{v:'123'},null,{v:'hello'}]
  function replaceNull(item) {
    if (item == null) {
      return { v: '' }
    }
    return item
  }
  data = row
    .map((item) => replaceNull(item))
    .map((item) => item.v)
  return data
}

users = getSheetData()