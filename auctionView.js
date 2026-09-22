// ============================================================================
// KINGS LEAGUE IMEX - AUCTION VIEW (SUBASTA FINAL DE PLAYOFFS)
// ============================================================================

import { store } from "../state/store.js";
import { toast } from "../components/toast.js";

export function renderAuctionView(container) {
  const auctions = store.auctionPlayers;
  const user = store.currentUser;
  const isAdmin = user.role === "ADMIN";

  const auctionCardsHtml = auctions.map((auc) => {
    const player = store.getPlayerById(auc.playerId);
    const isClosed = auc.status === "closed";
    const winnerTeam = auc.winnerTeamId ? store.getTeamById(auc.winnerTeamId) : null;

    return `
      <div style="background: var(--bg-secondary); border: 1px solid ${isClosed ? 'rgba(0,255,102,0.4)' : 'var(--border-medium)'}; border-radius: var(--radius-sm); padding: 1.5rem; clip-path: var(--clip-chamfer); display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <span class="badge ${isClosed ? 'badge-lime' : 'badge-yellow'}">
              ${isClosed ? 'SUBASTA CERRADA' : 'SUBASTA EN VIVO'}
            </span>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #fff; margin-top: 0.35rem;">
              ${auc.playerName}
            </h3>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Equipo anterior: ${auc.previousTeamName}</span>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.68rem; color: var(--text-muted); font-weight: 700;">PRECIO BASE:</div>
            <div style="font-family: var(--font-display); font-size: 1.4rem; color: var(--color-yellow); font-weight: 800;">${auc.baseValue}M</div>
          </div>
        </div>

        <!-- Peticiones / Ofertas de los Finalistas -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; background: rgba(0,0,0,0.35); padding: 1rem; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle);">
          <div style="border-right: 1px solid var(--border-subtle); padding-right: 0.5rem;">
            <div style="font-size: 0.7rem; color: var(--color-yellow); font-weight: 800;">OFERTA FINALISTA A:</div>
            <div style="font-family: var(--font-display); font-size: 1.8rem; color: #fff; font-weight: 900;">${auc.bidTeamA}M</div>
            ${
              isAdmin && !isClosed
                ? `<div style="display: flex; gap: 0.3rem; margin-top: 0.4rem;">
                    <input type="number" id="inputBidA_${auc.id}" class="form-control" style="padding: 0.3rem 0.5rem; font-size: 0.8rem;" value="${auc.bidTeamA}" />
                    <button class="btn btn-sm btn-outline-lime btn-save-bid-a" data-auc-id="${auc.id}">Pujar</button>
                   </div>`
                : ""
            }
          </div>

          <div style="padding-left: 0.5rem;">
            <div style="font-size: 0.7rem; color: #38BDF8; font-weight: 800;">OFERTA FINALISTA B:</div>
            <div style="font-family: var(--font-display); font-size: 1.8rem; color: #fff; font-weight: 900;">${auc.bidTeamB}M</div>
            ${
              isAdmin && !isClosed
                ? `<div style="display: flex; gap: 0.3rem; margin-top: 0.4rem;">
                    <input type="number" id="inputBidB_${auc.id}" class="form-control" style="padding: 0.3rem 0.5rem; font-size: 0.8rem;" value="${auc.bidTeamB}" />
                    <button class="btn btn-sm btn-outline-lime btn-save-bid-b" data-auc-id="${auc.id}">Pujar</button>
                   </div>`
                : ""
            }
          </div>
        </div>

        <!-- Ganador y Adjudicación -->
        ${
          isClosed
            ? `<div style="background: rgba(0, 255, 102, 0.1); border: 1px solid var(--color-lime); border-radius: var(--radius-xs); padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 0.68rem; color: var(--color-lime); font-weight: 800;">¡JUGADOR ADJUDICADO!</div>
                  <div style="font-weight: 800; color: #fff; font-size: 0.95rem;">${winnerTeam?.name || 'Finalista Ganador'}</div>
                </div>
                <div style="font-family: var(--font-display); font-size: 1.6rem; color: var(--color-lime); font-weight: 900;">
                  ${auc.finalPrice}M
                </div>
               </div>`
            : isAdmin
            ? `<div style="display: flex; gap: 0.6rem; align-items: center; justify-content: flex-end; border-top: 1px solid var(--border-subtle); padding-top: 0.85rem;">
                <select id="selectWinner_${auc.id}" class="form-select" style="width: auto; font-size: 0.82rem; padding: 0.4rem 0.6rem;">
                  <option value="team-1">Adjudicar a Los Cuervos (${auc.bidTeamA}M)</option>
                  <option value="team-5">Adjudicar a Galácticos (${auc.bidTeamB}M)</option>
                </select>
                <button class="btn btn-sm btn-lime btn-close-auction" data-auc-id="${auc.id}">
                  Cerrar Subasta
                </button>
               </div>`
            : `<div style="font-size: 0.75rem; color: var(--text-muted); text-align: center;">El organizador controla el martillo de la subasta.</div>`
        }
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div class="view-animate-fade">
      <div class="page-header">
        <div class="page-title-group">
          <span class="page-category-tag">PREVIA DE LA GRAN FINAL</span>
          <h1 class="page-title">🏷️ SUBASTA FINAL DE JUGADORES</h1>
          <p class="page-subtitle">Los dos equipos clasificados a la Final pueden pujar por los cracks de los equipos eliminados.</p>
        </div>
      </div>

      <div style="background: rgba(255, 230, 0, 0.08); border: 1px solid rgba(255, 230, 0, 0.3); border-radius: var(--radius-sm); padding: 1.25rem 1.5rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem;">
        <span style="font-size: 2.2rem;">🔨</span>
        <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5;">
          <strong>Dinámica de la Subasta:</strong> Los futbolistas de equipos que no alcanzaron la final pierden su blindaje y entran al draft de refuerzos. Cada finalista envía su puja máxima; la oferta superior se lleva al jugador descontando los fondos de su cartera.
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem;">
        ${auctionCardsHtml}
      </div>
    </div>
  `;

  // Listeners de puja si es Admin
  if (isAdmin) {
    container.querySelectorAll(".btn-save-bid-a").forEach((btn) => {
      btn.addEventListener("click", () => {
        const aucId = btn.dataset.aucId;
        const input = container.querySelector(`#inputBidA_${aucId}`);
        store.recordAuctionBid(aucId, "teamA", input.value);
        toast.show("Subasta", "Puja del Finalista A actualizada", "lime");
        renderAuctionView(container);
      });
    });

    container.querySelectorAll(".btn-save-bid-b").forEach((btn) => {
      btn.addEventListener("click", () => {
        const aucId = btn.dataset.aucId;
        const input = container.querySelector(`#inputBidB_${aucId}`);
        store.recordAuctionBid(aucId, "teamB", input.value);
        toast.show("Subasta", "Puja del Finalista B actualizada", "lime");
        renderAuctionView(container);
      });
    });

    container.querySelectorAll(".btn-close-auction").forEach((btn) => {
      btn.addEventListener("click", () => {
        const aucId = btn.dataset.aucId;
        const sel = container.querySelector(`#selectWinner_${aucId}`);
        const winnerTeamId = sel.value;
        const auc = store.auctionPlayers.find((a) => a.id === aucId);
        const finalPrice = winnerTeamId === "team-1" ? auc.bidTeamA : auc.bidTeamB;

        store.closeAuctionWinner(aucId, winnerTeamId, finalPrice);
        toast.show("¡Subasta Cerrada!", `Jugador adjudicado por ${finalPrice}M`, "lime");
        renderAuctionView(container);
      });
    });
  }
}
