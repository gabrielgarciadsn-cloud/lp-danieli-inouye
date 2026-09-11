# Landing page — Danieli Inouye

Landing page estática em HTML, CSS e JavaScript puros. Não há etapa de build.

## Abrir localmente

Abra `index.html` diretamente no navegador ou, para servir a pasta por HTTP, execute:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Substituir imagens

1. Salve os originais e as imagens otimizadas dentro de `assets/images/`.
2. No `index.html`, substitua o conteúdo do respectivo `.photo-placeholder` por uma tag `img` com caminho relativo, por exemplo:

```html
<img src="assets/images/foto-abertura.webp" alt="Descrição da foto fornecida" width="1200" height="800" loading="lazy" decoding="async">
```

Para prints de depoimentos, mantenha a imagem inteira e legível, sem recorte. Para fotos, ajuste o enquadramento responsivo em `css/styles.css` usando `object-position` quando necessário.

As sete imagens já implementadas usam cópias WebP sem perdas e mantêm os PNGs originais. Os enquadramentos estão em `css/images.css`. `scripts/optimize-images.py` permite regenerar essas cópias com Python e Pillow; é uma ferramenta opcional de manutenção, não uma etapa de build. As dimensões HTML devem corresponder às dimensões reais de cada imagem.

## Publicar

No GitHub, envie `index.html`, `css/`, `js/` e `assets/`. Na Vercel, importe o repositório como projeto estático, mantenha o preset como **Other** e não configure comando de build; o diretório de saída é a raiz do projeto.

Os CTAs apontam para `#oferta`. Troque o destino somente quando o link real de checkout estiver disponível.
