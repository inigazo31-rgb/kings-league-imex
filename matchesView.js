// ============================================================================
// KINGS LEAGUE IMEX - MATCHES VIEW
// ============================================================================

import { store } from "../state/store.js";

export function renderMatchesView(container) {
  let activeFilter = "all";

  function update() {
    let filtered = [...store.matches];

    if (activeFilter === "upcoming") {
      filtered = filtered.filter((m) => m.status === "scheduled");
    } else if (activeFilter === "results") {
      filtered = filtered.filter((m) => m.status === "finished");
    } else if (activeFilter === "j1") {
      filtered = filtered.filter((m) => m.matchday === 1);
    } else if (activeFilter === "j2") {
      filtered = filtered.filter((m) => m.matchday === 2);
    } else if (activeFilter === "playoffs") {
      filtered = filtered.filter((m) => m.phase === "semifinals" || m.phase === "final");
    }

    const matchesCardsHtml = filtered.length === 0
      ? `<div style="text-align: center; padding: 3rem; color: var(--text-muted);">No hay partidos en esta categoría.</div>`
      : filtered.map((m) => {
          const homeTeam = store.getTeamById(m.homeTeamId);
          const awayTeam = store.getTeamById(m.awayTeamId);
          const mvp = store.getPlayerById(m.mvpPlayerId);
          const isFinished = m.status === "finished";

          const cardsHtml = m.cardsUsed && m.cardsUsed.length > 0
            ? m.cardsUsed.map((c) => `<span class="event-chip card-event">🃏 ${c.cardName}: ${c.result}</span>`).join("")
            : "";

          const diceHtml = m.diceEvent
            ? `<span class="event-chip dice-event">🎲 ${m.diceEvent}</span>`
            : "";

          const scorersHtml = m.scorers && m.scorers.length > 0
            ? `<div style="margin-top: 0.5rem; font-size: 0.76rem; color: var(--text-secondary);">
                <strong>⚽ Goles:</strong> ${m.scorers.map((s) => {
                  const p = store.getPlayerById(s.playerId);
                  return `${p?.name || 'Jugador'} (${s.minute}'${s.type === 'doble' ? ' x2' : ''})`;
                }).join(", ")}
               </div>`
            : "";

          const bookingsHtml = m.bookings && m.bookings.length > 0
            ? `<div style="margin-top: 0.35rem; font-size: 0.74rem; color: var(--text-muted);">
                <strong>Tarjetas:</strong> ${m.bookings.map((b) => {
                  const p = store.getPlayerById(b.playerId);
                  return `${b.card === 'red' ? '🟥' : '🟨'} ${p?.name || 'Jugador'} (${b.minute}')`;
                }).join(", ")}
               </div>`
            : "";

          return `
            <div class="match-card">
              <div class="match-card-top">
                <div>
                  <span class="match-matchday-label">${m.title || `JORNADA 0${m.matchday}`}</span>
                  ${m.group ? `<span class="badge badge-metallic" style="margin-left: 0.5rem;">GRUPO ${m.group}</span>` : ""}
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span class="match-venue">📍 ${m.pitch || 'Cancha IMEX'} &bull; ⏰ ${m.time} hrs</span>
                  <span class="badge ${isFinished ? 'badge-lime' : 'badge-yellow'}">
                    ${isFinished ? 'FINALIZADO' : 'PROGRAMADO'}
                  </span>
                </div>
              </div>

              <div class="match-scoreboard">
                <div class="match-team">
                  <div class="match-team-logo" style="background: ${homeTeam?.logoBg || '#1A1A1A'}">
                    ${homeTeam?.logoText || '⚽'}
                  </div>
                  <div>
                    <div class="match-team-name">${homeTeam?.name || 'Por definir'}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${homeTeam ? 'Pres: ' + homeTeam.president : ''}</div>
                  </div>
                </div>

                <div class="match-score-center">
                  ${
                    isFinished
                      ? `<div class="match-score-display">${m.homeScore} - ${m.awayScore}</div>`
                      : `<div class="match-vs-display">VS</div><span style="font-size: 0.75rem; color: var(--text-secondary);">${m.date}</span>`
                  }
                </div>

                <div class="match-team away">
                  <div class="match-team-logo" style="background: ${awayTeam?.logoBg || '#1A1A1A'}">
                    ${awayTeam?.logoText || '⚽'}
                  </div>
                  <div>
                    <div class="match-team-name">${awayTeam?.name || 'Por definir'}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${awayTeam ? 'Pres: ' + awayTeam.president : ''}</div>
                  </div>
                </div>
              </div>

              <div class="match-card-footer" style="flex-direction: column; align-items: flex-start;">
                <div class="match-special-events">
                  ${cardsHtml}
                  ${diceHtml}
                </div>
                ${scorersHtml}
                ${bookingsHtml}
                ${mvp ? `<div style="margin-top: 0.4rem; color: var(--color-yellow); font-weight: 700; font-size: 0.75rem;">⭐ Jugador del Partido (MVP): ${mvp.name}</div>` : ""}
                ${m.notes ? `<div style="margin-top: 0.4rem; font-style: italic; color: var(--text-muted); font-size: 0.72rem;">"${m.notes}"</div>` : ""}
              </div>
            </div>
          `;
        }).join("");

    container.innerHTML = `
      <div class="view-animate-fade">
        <div class="page-header">
          <div class="page-title-group">
            <span class="page-category-tag">CALENDARIO & RESULTADOS</span>
            <h1 class="page-title">⚽ PARTIDOS DE LA COMPETICIÓN</h1>
            <p class="page-subtitle">Resultados oficiales, próximas jornadas, cartas utilizadas y dados del recreo.</p>
          </div>

          <!-- Filtros de Partidos -->
          <div class="tab-nav" id="matchesFilterNav">
            <button class="tab-btn ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">TODOS</button>
            <button class="tab-btn ${activeFilter === 'upcoming' ? 'active' : ''}" data-filter="upcoming">PRÓXIMOS</button>
            <button class="tab-btn ${activeFilter === 'results' ? 'active' : ''}" data-filter="results">RESULTADOS</button>
            <button class="tab-btn ${activeFilter === 'j1' ? 'active' : ''}" data-filter="j1">JORNADA 01</button>
            <button class="tab-btn ${activeFilter === 'j2' ? 'active' : ''}" data-filter="j2">JORNADA 02</button>
            <button class="tab-btn ${activeFilter === 'playoffs' ? 'active' : ''}" data-filter="playoffs">PLAYOFFS</button>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${matchesCardsHtml}
        </div>
      </div>
    `;

    container.querySelectorAll("#matchesFilterNav .tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.dataset.filter;
        update();
      });
    });
  }

  update();
}
