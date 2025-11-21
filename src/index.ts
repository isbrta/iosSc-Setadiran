import { SiApiClient } from './client';
import { loadFromFile, saveToFile } from './lib/scriptable';

async function main() {
  const si = new SiApiClient();
  try {
    const data = await loadFromFile('sb.json', true);
    si.state.deserialize(data);

    // login

    const isLoggedIn = await si.portal.isLoggedIn();
    if (!isLoggedIn) {
      const captchaImage = await si.portal.captchaImage();
      await QuickLook.present(captchaImage);
      const alert = new Alert();
      alert.title = 'captcha';
      alert.message = 'code?';
      alert.addTextField('code', '');
      alert.addAction('ok');
      await alert.presentAlert();

      const login = await si.portal.login('saberrostami', 'Saber@137227', alert.textFieldValue(0));
      if (login) {
      }
    }
    await si.portal.selectRole('SR910426', 955, -2);
  } finally {
    saveToFile('sb.json', si.state.serialize());
  }

  // try {

  /* test 1
  let feed = si.feed.cards({
    searchTypeCode: 1,
    keyword: '3104106959000158',
  });


  feed.items$.subscribe({
    next: (cs) => {
      const myCard = cs[0];
      console.log(myCard.toJSON());
      Promise.resolve().then(async () => await QuickLook.present(myCard.toJSON()));
    }
  }); */

  /* test 2 
  const cards = await feed.items();
  const myCard = cards[0];
  console.log(myCard.toJSON());
  await QuickLook.present(myCard.toJSON());

  const catalog = await myCard.catalog();
  await QuickLook.present(catalog);

  const details = await myCard.detail();
  await QuickLook.present(details);

  const owner = await myCard.owner();
  await QuickLook.present(owner);

  const parent = await myCard.parent();
  await QuickLook.present(parent);

  const commission = await myCard.commission();
  await QuickLook.present(commission);

  const countTotalAppendix = await myCard.countTotalAppendix();
  await QuickLook.present(countTotalAppendix);
*/
  //myCard.
  //  } catch (e) {
  //   console.error(e);
  //  } finally {
  //   log(saveToFile('sb.json', si.state.serialize()));
  // }
}
main().catch((e) => {
  throw e;
});
