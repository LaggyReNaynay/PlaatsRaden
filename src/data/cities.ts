export type City = { id:string; name:string; country:string; lat:number; lng:number; facts:string[] };
export const cities: City[] = [
 {id:'hengelo',name:'Hengelo',country:'Nederland',lat:52.2658,lng:6.7931,facts:['Hengelo ligt in Twente.','De stad groeide sterk door industrie en spoorwegen.','Het Twentekanaal is belangrijk voor bedrijvigheid.']},
 {id:'hannover',name:'Hannover',country:'Duitsland',lat:52.3759,lng:9.7320,facts:['Hannover heeft het grote stadsmeer Maschsee.','De stad is bekend van grote beurzen.','Het ligt in de deelstaat Nedersaksen.']},
 {id:'porto',name:'Porto',country:'Portugal',lat:41.1579,lng:-8.6291,facts:['Porto ligt aan de rivier de Douro.','De historische binnenstad staat op de UNESCO-lijst.','Portwijn is wereldwijd met Porto verbonden.']},
 {id:'helsinki',name:'Helsinki',country:'Finland',lat:60.1699,lng:24.9384,facts:['Helsinki ligt aan de Finse Golf.','De stad heeft veel eilanden en parken.','Het is de hoofdstad van Finland.']},
 {id:'kathmandu',name:'Kathmandu',country:'Nepal',lat:27.7172,lng:85.3240,facts:['Kathmandu ligt in een vallei.','De stad is omringd door heuvels en bergen.','Het is een belangrijk cultureel centrum van Nepal.']},
 {id:'kaapstad',name:'Kaapstad',country:'Zuid-Afrika',lat:-33.9249,lng:18.4241,facts:['Kaapstad ligt bij de Tafelberg.','Castle of Good Hope is een bekend historisch fort.','De stad ligt aan de Atlantische Oceaan.']},
 {id:'koeweit',name:'Koeweit-Stad',country:'Koeweit',lat:29.3759,lng:47.9774,facts:['Koeweit-Stad ligt aan de Perzische Golf.','De stad heeft een moderne skyline.','Olie speelt een grote rol in de economie.']}
];
