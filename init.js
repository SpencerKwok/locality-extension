const createImageDisplay = (images /* img[] */) => {
  const imageDisplay = document.createElement("div");
  imageDisplay.className = "locality-stack-horizontal";
  images.forEach((img) => {
    imageDisplay.appendChild(img);
  });
  return imageDisplay;
};

const createCheckItOutButton = (query /* string */) => {
  const checkItOut = document.createElement("button");
  checkItOut.className = "locality-check-it-out";
  checkItOut.innerText = "Check  it  out!";
  checkItOut.onclick = () => {
    window.open(`https://www.mylocality.shop/search?q=${query}`);
  };
  return checkItOut;
};

const createCloseButton = () => {
  const close = document.createElement("a");
  close.className = "locality-close";
  close.onclick = () => {
    document.querySelector("#searchform").removeChild(display);
  };
  return close;
};

const createImages = async (query /* string */) => {
  let imgs = [];
  await fetch(`https://www.mylocality.shop/api/search?q=${query}`)
    .then((res) => res.json())
    .then((data) => {
      const hits = data.hits;
      hits.slice(0, 3).forEach(({ img, link, price, product }) => {
        const image = document.createElement("img");
        image.className = "locality-img";
        image.src = img;
        image.alt = product;

        const priceLabel = document.createElement("h5");
        priceLabel.className = "locality-label";
        priceLabel.innerText = `$${price.toFixed(2)} CAD`;

        const productLabel = document.createElement("h5");
        productLabel.className = "locality-label";
        productLabel.innerText = product;

        const a = document.createElement("a");
        a.className = "locality-link";
        a.href = link;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.appendChild(image);
        a.appendChild(productLabel);
        a.appendChild(priceLabel);

        imgs.push(a);
      });
    })
    .catch((err) => console.log(err));
  return imgs;
};

const createIntro = (query /* string */) => {
  const intro = document.createElement("p");
  intro.className = "locality-intro";
  intro.innerText = `Here are the results for "${query}" in your area!`;
  return intro;
};

const createLogo = () => {
  const logo = document.createElement("div");
  logo.className = "locality-logo";
  logo.innerHTML = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595.28 200"><defs><style>.cls-1{fill:#449ed7;}.cls-2{fill:none;stroke:#fff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:2px;}.cls-3{fill:#fff;}</style></defs><path class="cls-1" d="M178.1,66.24h8v45.92h25v7.2h-33Z"/><path class="cls-1" d="M255.14,100.4c0-11.28,7.68-19.44,18.72-19.44,8.88,0,14.48,4.8,16.8,12.16l-7.52,2.32c-1.28-4.8-4-7.84-9.44-7.84-6.56,0-10.64,5.2-10.64,12.72v.32c0,7.44,3.84,12.72,10.4,12.72,6.08,0,8.72-3.12,10-8.24l7.52,2.32c-2.48,7.68-8.16,12.56-17.36,12.56C262.34,120,255.14,111.92,255.14,100.4Z"/><path class="cls-1" d="M294.42,109.44c0-8.48,6.32-10.4,14.72-12.24,6.4-1.36,10.32-1.76,11.12-3.84V92.8c0-3.12-2.32-5.52-8.08-5.52-5.6,0-8.64,2.56-9,6.8v.48H295.3c.24-8.48,7-13.6,17-13.6,9.68,0,15.44,4.32,15.44,13.92v18.64l.08,5.84h-7.6v-5.68c-2.56,4.48-7.28,6.64-12.72,6.64C299.38,120.32,294.42,115.92,294.42,109.44Zm25.84-5.28V99.52c-2.32,1.6-6.32,2.24-10,3.12-4.32,1.12-7.84,2.48-7.84,6.48,0,3.12,2.32,5.2,6.48,5.2C314.42,114.32,319.62,111.52,320.26,104.16Z"/><path class="cls-1" d="M335.54,65.44h7.92v53.92h-7.92Z"/><path class="cls-1" d="M351.54,67.2H360v8.32h-8.48Zm.24,14.4h7.92v37.76h-7.92Z"/><path class="cls-1" d="M371.06,109.92V88.32h-6V81.6h6V74.24l7.6-4.72V81.6h8.16v6.72h-8.16V109c0,2.4,1,3.52,3.36,3.52h4.48v6.88h-6.72C372.9,119,371.14,115.92,371.06,109.92Z"/><path class="cls-1" d="M391,127.44h3.6c5.2,0,6.4-1.12,9.36-8.8l-14.56-37h8.24l10.08,28.16,9.2-28.16h8.32l-14.48,40.48c-3.44,9-6.72,12.48-15.76,12.48h-4Z"/><path class="cls-1" d="M248.9,97.61c0,.25,0,.47,0,.71a17.09,17.09,0,0,1-4.32,9.8c-.18.2-.38.4-.6.62l-9.69,9.69a1.94,1.94,0,0,1-2.78,0l-10-10a16,16,0,0,1-2.8-3.77,14.68,14.68,0,0,1-.87-1.9,16.13,16.13,0,0,1,3.67-17.08A17.28,17.28,0,0,1,224,83.63a12.21,12.21,0,0,1,1.38-.82,16.76,16.76,0,0,1,2.14-.94,13.35,13.35,0,0,1,2.27-.6,16.09,16.09,0,0,1,3.92-.29c.31,0,.6,0,.91.09s.58.07.87.11.58.11.87.18.58.13.87.2c.55.18,1.11.36,1.67.58.29.11.55.22.82.35s.47.25.69.36a12.27,12.27,0,0,1,1.78,1.09c.23.15.43.31.63.47a16.44,16.44,0,0,1,2.67,2.67.76.76,0,0,1,.11.14,6.36,6.36,0,0,1,.69,1c.15.21.31.46.44.68a13.46,13.46,0,0,1,.93,1.81,14.8,14.8,0,0,1,.67,1.9,13.49,13.49,0,0,1,.34,1.5,12.44,12.44,0,0,1,.18,1.56A18.21,18.21,0,0,1,248.9,97.61Z"/><path class="cls-2" d="M220.69,103.71h3.64a2.29,2.29,0,0,1,1.64.69l2.44,2.5a2.29,2.29,0,0,0,3.29,0l6-6.1a2.36,2.36,0,0,0,0-3.32l-3.18-3.23a2.29,2.29,0,0,0-3.28,0L229.56,96a2.28,2.28,0,0,1-3.28,0,2.35,2.35,0,0,1,0-3.33l5.42-5.49a2.26,2.26,0,0,1,1.65-.69h1.94a2.29,2.29,0,0,1,1.64.69l3.76,3.8a2.19,2.19,0,0,0,1.62.69h3.63"/><path class="cls-3" d="M248.34,92.59h-2.51v-1.9h1.84A14.8,14.8,0,0,1,248.34,92.59Z"/><path class="cls-3" d="M220.68,102.76v1.9h-2a14.68,14.68,0,0,1-.87-1.9Z"/></svg>`;
  return logo;
};

const getQuery = () => {
  const query = decodeURIComponent(
    window.location.search.match(/(?<=q=)[^&]*/g)[0]
  ).replace("+", " ");
  return query;
};

(async function () {
  window.addEventListener("load", async function () {
    const display = document.createElement("div");
    display.className = "locality-window";

    const query = getQuery();
    await createImages(query).then((images) => {
      if (images.length < 3) {
        // Not enough options to display, don't show the popup
        return;
      }
      const closebtn = createCloseButton();
      const checkItOut = createCheckItOutButton(query);
      const imageDisplay = createImageDisplay(images);
      const intro = createIntro(query);
      const logo = createLogo();

      const content = document.createElement("div");
      content.className = "locality-stack-vertical";
      content.appendChild(logo);
      content.appendChild(intro);
      content.appendChild(imageDisplay);
      content.appendChild(checkItOut);

      display.appendChild(content);
      display.appendChild(closebtn);

      const shadow = document.createElement("div");
      shadow.className = "locality-shadow";
      shadow.appendChild(display);

      document.querySelector("#searchform").appendChild(shadow);
    });
  });
})();
