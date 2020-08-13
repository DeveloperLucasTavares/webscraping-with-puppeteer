const puppeteer = require('puppeteer');
const fs = require('fs');

async function instagramScraper() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://instagram.com/rocketseat_oficial');

    const imgList = await page.evaluate(() => {
        const nodeList = document.querySelectorAll('article img');

        const imgArray = [...nodeList];

        const imgList = imgArray.map(img => ({
                src: img.src,
            })
        );
        return imgList;
    });

    fs.writeFile('./data/instagram.json', JSON.stringify(imgList, null, 2), err => {
        if (err) throw new Error('Algo deu errado');

        console.log(`${imgList.length} imagens salvas com sucesso`);
    });

    await browser.close();
}

async function amazonScraper() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.amazon.com.br/gp/bestsellers/books/ref=zg_bs_pg_1?ie=UTF8&pg=1');
    
    const bookList = await page.evaluate(() => {
        const nodeList = document.querySelectorAll('div.a-section.a-spacing-none.aok-relative');

        const bookArray = [...nodeList];

        const bookList = bookArray.map(book => {
            let author = '';
            try {
            if(book.querySelector('span.a-size-small.a-color-base') !== null){
                author = book.querySelector('span.a-size-small.a-color-base').innerHTML;
            }
            else if(book.querySelector('a.a-size-small.a-link-child') !== null) {
                author = book.querySelector('a.a-size-small.a-link-child').innerHTML;
            }

            return ({
                url: book.querySelector('.a-link-normal').href,
                src: book.querySelector('img').src,
                title: book.querySelector('img').alt,
                author,
                price: book.querySelector('span.p13n-sc-price').innerHTML,
            })
        } catch {
            if(book.querySelector('span.a-size-small.a-color-base') === null && 
               book.querySelector('div.a-row.a-size-small') === null) throw new Error('Error');
            }
        });

        return bookList;
    });

    fs.writeFile('./data/amazon-books.json', JSON.stringify(bookList, null, 2), err => {
        if(err) throw new Error('Something went wrong');

        console.log(`Total de ${bookList.length} livros registrados`);
    })

    await browser.close();
}