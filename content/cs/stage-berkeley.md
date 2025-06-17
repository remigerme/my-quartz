---
title: Objectif du stage à UC Berkeley
date: 2025-03-12
---
Généralement, quand une personne **A** apprend que je vais en stage à UC Berkeley (_University of California, Berkeley_), à côté de San Francisco donc, cela donne lieu à un échange comme ça :

> [!quote] Situation standard
> **A** : Bravo pour le stage !  
> **moi** : Merci.  
> **A** : Mais du coup, tu vas y faire quoi ?  
> **moi** : Je vais contribuer au développement d'un outil vérifié formellement pour la synthèse de circuits électroniques.  
> **A**, *n'a visiblement pas compris* : Ah. Eh beh. Ça doit être sympa.

Bon, malheureusement, si vous êtes là c'est que ces termes ne doivent pas vous parler beaucoup - et c'**est bien normal** ! Tellement normal que plutôt que d'avoir à réinventer une explication à chaque fois, je vais l'écrire une fois (ce qui ne m'empêchera pas de tenter de ré-expliquer à l'oral mais de finir par rediriger vers ici dans tous les cas).

Pour ça, il va falloir expliquer deux choses distinctes :
- les **outils de synthèse** dans l'industrie du semi-conducteur
- les **méthodes formelles** informatiques
-----

> [!warning] Petit avertissement pour les spécialistes
> Cette page est destinée à un public le plus vaste possible, potentiellement non-scientifique - pas pour des spécialistes donc. Des approximations grossières sont donc faites par souci de pédagogie. Cependant, certaines notes de bas de page renvoient vers des références plus sérieuses pour creuser.


# Zoom sur l'industrie du semi-conducteur
Créer des circuits électroniques, c'est sympa, mais c'est compliqué. À l'heure actuelle, les CPU (_Central Processing Unit_, qui sont les "cerveaux" des objets électroniques) comportent plusieurs milliards de transistors (le composant électronique élémentaire). Ça fait un paquet de transistors à agencer correctement pour qu'ils fassent ce qu'on veule. Heureusement, ce travail ne se fait pas à la main et des tas de logiciels ont été développés pour concevoir des circuits.[^eda] Malheureusement, **ces logiciels ont des bugs**[^fuzzing], ce qui expliquera la démarche de méthodes formelles présentées après.

Les logiciels qui m'intéressent sont les outils de synthèse. Ce sont des logiciels qui prennent **en entrée une représentation "logique" des circuits** (c'est-à-dire des informations sur le comportement du circuit), dans un langage appelé **Verilog**[^verilog], et qui génèrent à partir de ça **une netlist de transistors**, c'est-à-dire une grande carte physique "prête à graver" des transistors du circuit électronique.

![[verilog-a-netlist.svg]]
> [!info]- Analogie avec la compilation
> Pour celleux qui ont entendu parler de compilation, la situation est assez analogue au travail que ferait un compilateur.
> 
> |              | langage source | langage cible |
> | ------------ | -------------- | ------------- |
> | **synthétiseur** | Verilog        | netlist       |
> | **compilateur**  | C++              | asm x86       |

Ces opérations sont complexes et intensives et durent en général de **plusieurs heures à plusieurs jours**.

Comme évoqué précédemment, ces logiciels comportent des bugs. Cela entraîne que la ***sémantique*** du circuit n'est pas forcément préservée : le circuit décrit sous forme de Verilog peut **ne pas avoir le même comportement** que le circuit en sortie, sous forme de netlist. Un circuit bien conçu en Verilog peut donc, à la sortie de la synthèse, comporter des erreurs, introduites par le logiciel de synthèse utilisé.

Ce défaut est très gênant et a donc motivé l'apparition de méthodes de validation des netlists produites. L'idée est d'avoir un autre logiciel, qui va prendre la source Verilog ainsi que la netlist, et **vérifier si elles ont bien toutes les deux le même comportement**[^formality]. Le problème est qu'il faut alors effectuer cette étape de vérification à **chaque nouvelle synthèse**, étape qui est elle aussi intensive et dure elle aussi entre **plusieurs heures à plusieurs jours**. À noter que le logiciel de vérification non plus n'est pas complètement exempt de bugs.

Historiquement, le terme "méthodes formelles" est utilisé  au sein de l'industrie du semi-conducteur pour désigner ce processus de vérification au cas par cas. Nous allons voir qu'il peut désigner une approche bien plus intéressante.

# Les méthodes formelles informatiques
L'idée est simple : plutôt que de procéder à des vérifications au cas par cas sur chaque synthèse effectuée, nous allons plutôt **prouver que le logiciel de synthèse lui-même est correct**. Alors nécessairement, le comportement des circuits en entrée sera préservé jusqu'en sortie.

*Comment ça, on peut prouver des logiciels ?*  
Oui ! De la même manière qu'en maths on peut prouver un théorème, il existe des méthodes (assez récentes) pour prouver des propriétés sur des logiciels. Malheureusement, on ne peut pas juste prendre les logiciels existants et prouver des choses dessus. Ça serait trop beau. Pour ça, il faut comprendre ce que ça veut dire que de prouver des propriétés sur un programme informatique[^proof].

La grande difficulté c'est d'arriver à exprimer de manière formelle (mathématique) les propriétés que l'on veut prouver. Dire qu'un programme est correct, c'est une phrase en français, mais ce n'est pas une propriété très bien définie. L'enjeu, c'est d'arriver à formaliser la notion de comportement pour le Verilog, pour les netlists, et raisonner sur les algorithmes qui permettent de passer de l'un à l'autre.

De nombreux langages et assistants de preuves dédiés à ce but de formalisation et de preuve ont vu le jour[^provers]. Cependant, ils ne peuvent pas se greffer à des projets existants. Ce sont les projets qui doivent être développés dans l'optique d'être prouvé depuis le départ, et utiliser l'écosystème de l'assistant de preuves sur lequel ils vont se baser.

> [!info]- Analogie avec la compilation
> Cette démarche de prouver directement le compilateur plutôt que les programmes un à un est exactement ce que fait le projet [CompCert](https://compcert.org/), un compilateur C vérifié formellement développé avec Rocq (anciennement Coq). L'idée du stage est donc de contribuer au (peut-être futur si l'on est très optimiste) CompCert des outils de synthèse pour la microélectronique.

# Et le stage dans tout ça ?
On peut enfin y venir !

L'objectif est donc de contribuer aux efforts de développement de logiciels de synthèse vérifiés formellement[^lutsig]. Bien que des initiatives existent à l'heure actuelle[^current], elles ne sont pas encore largement adoptées. Plusieurs raisons peuvent expliquer cette non-adoption :
- le sous-ensemble du langage en entrée (Verilog) est trop restrictif, certaines fonctionnalités ne sont pas encore prises en compte
- les netlists obtenues ne sont pas suffisamment bonnes selon des critères d'évaluation (problème de performance des sorties)
- le logiciel est trop lent pour une utilisation sur des cas réels (problème de performance du logiciel lui-même)

Le but est donc de comprendre un peu mieux ce qui bloque, et essayer si possible de surmonter ces obstacles.

> [!note] Bifurcation vers un sujet connexe
> Ce qui est décrit ci-dessus était censé être le contenu du stage, mais après quelques semaines à Berkeley, j'ai bifurqué vers un sujet connexe. Le contexte reste similaire, et la problématique reste la vérification d'outils de synthèse, mais l'angle d'approche est différent.  



[^eda]: C'est ce qu'on appelle la conception assistée par ordinateur (CAO) pour l'électronique. Plus sur la page [wikipedia](https://fr.wikipedia.org/wiki/Conception_assist%C3%A9e_par_ordinateur_pour_l%27%C3%A9lectronique). On parle d'*Electronic Design Automation* (EDA) *tools* en anglais.

[^fuzzing]: À l'heure actuelle, de nombreuses démarches de *fuzzing* ont trouvé un nombre significatif de bugs. Des [références](https://yannherklotz.com/docs/masters-thesis-verismith.pdf) en [vrac](https://comsec.ethz.ch/research/hardware-design-security/mirtl/).

[^verilog]: Il existe bien d'autres langages alternatifs de description matériel ([Bluespec](https://dl.acm.org/doi/pdf/10.1145/3385412.3385965), [VHDL](https://fr.wikipedia.org/wiki/VHDL), ...), mais Verilog est celui sur lequel je me concentrerai. Il s'agit du langage le plus répandu.

[^formality]: Un logiciel auquel je pense est [Formality](https://www.synopsys.com/implementation-and-signoff/signoff/formality-equivalence-checking.html) de Synopsys, leader du marché des logiciels de conception pour la microélectronique.

[^proof]: La preuve formelle et la théorie des types nécessiterait un article entier (voire plusieurs). Pour creuser, vous pouvez consulter (par ordre d'investissement nécessaire) :
	- cette superbe [vidéo d'introduction](https://www.youtube.com/watch?v=BQNOjum8YlU) à la théorie des types
	- des ressources sur la [correspondance de Curry-Howard](https://fr.wikipedia.org/wiki/Correspondance_de_Curry-Howard)
	- l'excellent [cours](https://www.lix.polytechnique.fr/Labo/Samuel.Mimram/teaching/INF551/) de Samuel Mimram donné à l'X

[^provers]: Comme [Agda](https://github.com/agda/agda), [Rocq](https://rocq-prover.org/), [HOL4](https://github.com/HOL-Theorem-Prover/HOL), ...

[^lutsig]: De manière très pratico-pratique, cette contribution pourrait se faire via des contributions au logiciel open source [Lutsig](https://github.com/CakeML/hardware), qui semble être le plus prometteur des logiciels de synthèse pour Verilog vérifié formellement.

[^current]: Autre que [Lutsig](https://cakeml.org/cpp21.pdf) mentionné précédemment, il existe aussi des alternatives pour des variantes de Bluespec comme [Koika](https://dl.acm.org/doi/10.1145/3385412.3385965) et un [synthétiseur pour *Fe-Si*](https://link.springer.com/chapter/10.1007/978-3-642-39799-8_14).

