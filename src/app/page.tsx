import {redirect} from "next/navigation";
import {routing} from "@/i18n/routing"; 

const MetaData = {
  title: 'Svoy Lounge',
  description: 'Svoy Lounge - ресторан и караоке в Астана. Лучшее место для отдыха с друзьями и семьей. Наслаждайтесь изысканной кухней и живой музыкой в уютной атмосфере.',
}

export default function Page() {
  redirect(`/${routing.defaultLocale}`);
}
