# Balisage Schema.org des médias (vidéo, image, audio)

`scripts/media-schema.mjs` ajoute automatiquement le balisage Schema.org des médias à toutes les pages HTML de `public/` :

| Ce qui est dans la page | Balisage ajouté |
|---|---|
| Une vidéo YouTube intégrée (`<iframe src="https://www.youtube-nocookie.com/embed/ID">`) | `VideoObject` |
| Une vidéo hébergée ailleurs : `<video data-media="cle">` | `VideoObject` |
| Une image principale `<img class="cover">` ou toute image avec `data-schema-image` | `ImageObject` (créateur, droits d'auteur, page de licence) |
| Un audio : `<audio data-media="cle">` ou un lecteur de balado avec `data-audio="cle"` | `AudioObject` |

Le bloc est écrit dans `<script type="application/ld+json" data-media-schema>` et remplacé à chaque exécution. Le script tourne aussi automatiquement avant chaque build (`prebuild`).

## Ajouter un nouveau contenu

1. **Intégrer le média dans la page** comme d'habitude (voir le tableau ci-dessus).
2. **Ajouter ses informations dans `scripts/media-registry.json`** :

   **Vidéo YouTube** : la clé est l'identifiant YouTube (la partie après `v=`).
   ```json
   "videos": {
     "ID_YOUTUBE": {
       "uploadDate": "2026-11-06T10:00:00-05:00",
       "duration": 95,
       "en": { "name": "Titre anglais", "description": "Une phrase qui décrit la vidéo." },
       "fr": { "name": "Titre français", "description": "Une phrase qui décrit la vidéo." },
       "clips": [
         { "start": 0, "en": "Setup", "fr": "Préparation" },
         { "start": 35, "en": "Anchors", "fr": "Ancrages" }
       ]
     }
   }
   ```
   `duration` est en secondes. `clips` (moments clés) est optionnel.

   **Audio (balado, capsule)** :
   ```json
   "audio": {
     "balado-quebec-2026": {
       "contentUrl": "https://lien-vers-le-fichier.mp3",
       "embedUrl": "https://lien-du-lecteur",
       "uploadDate": "2026-11-06",
       "duration": 1800,
       "en": { "name": "...", "description": "...", "transcript": "Résumé ou transcription" },
       "fr": { "name": "...", "description": "...", "transcript": "..." }
     }
   }
   ```
   Mettre aussi un résumé ou une transcription visible sous le lecteur : Google lit le texte, pas le son.

   **Image** : rien d'obligatoire. Le texte `alt` sert de nom. On peut préciser un nom ou une légende par langue :
   ```json
   "images": {
     "/resources/mon-article/image.png": {
       "en": { "name": "...", "caption": "..." },
       "fr": { "name": "...", "caption": "..." }
     }
   }
   ```
3. **Lancer `npm run media-schema`.** La commande met les pages à jour et signale ce qui manque. Faire le commit des pages modifiées.
4. **Vérifier** la page avec l'outil de test des résultats enrichis de Google : https://search.google.com/test/rich-results

## Bonnes pratiques

- La vidéo doit être un contenu important de la page, avec 1 ou 2 phrases de description visibles autour.
- Noms de fichiers d'images descriptifs (`taping-cheville-etape-3.png`) et texte `alt` précis.
- Les images pointent vers la page de licence : `/image-use/` (EN) et `/fr/utilisation-images/` (FR).
