import { useState } from 'react';
import { PageHeader } from '@/components/shared/SectionHeader';
import { StateChip } from '@/components/shared/StateChip';
import { SparkLine } from '@/components/charts/SparkLine';
import { mockTeamMembers } from '@/data/mock/team';
import { TeamMember } from '@/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const RANK_STYLES: Record<number, { bg: string; color: string; label: string }> = {
  1: { bg: 'rgba(255, 215, 0, 0.12)', color: '#ffd700', label: '#1' },
  2: { bg: 'rgba(192, 192, 192, 0.12)', color: '#c0c0c0', label: '#2' },
  3: { bg: 'rgba(205, 127, 50, 0.12)', color: '#cd7f32', label: '#3' },
};

function MemberRow({ member, onSelect }: { member: TeamMember; onSelect: (m: TeamMember) => void }) {
  const isDisconnected = member.status !== 'active';
  const rankStyle = RANK_STYLES[member.rank] ?? null;

  return (
    <tr
      style={{
        borderBottom: '1px solid var(--tt-border)',
        cursor: isDisconnected ? 'default' : 'pointer',
        opacity: isDisconnected ? 0.5 : 1,
        transition: 'background 0.1s',
      }}
      onClick={() => !isDisconnected && onSelect(member)}
      data-testid={`member-row-${member.id}`}
    >
      {/* Rank */}
      <td style={{ padding: '10px 12px', width: 48 }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 26,
          height: 26,
          borderRadius: 5,
          background: rankStyle?.bg ?? 'var(--tt-bg)',
          color: rankStyle?.color ?? 'var(--tt-text-muted)',
          fontSize: 10,
          fontFamily: 'JetBrains Mono',
          fontWeight: 700,
          border: `1px solid ${rankStyle?.color ?? 'var(--tt-border)'}44`,
        }}>
          {member.rank}
        </span>
      </td>
      {/* Identity */}
      <td style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: isDisconnected ? 'var(--tt-bg)' : 'var(--tt-accent-soft)',
            border: `1px solid ${isDisconnected ? 'var(--tt-border)' : 'var(--tt-accent)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontFamily: 'JetBrains Mono',
            color: isDisconnected ? 'var(--tt-text-muted)' : 'var(--tt-accent)',
            fontWeight: 600,
            flexShrink: 0,
          }}>
            {member.avatar}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, fontFamily: "'Space Grotesk', sans-serif", color: 'var(--tt-text-primary)', lineHeight: 1.2 }}>{member.name}</div>
            <div style={{ fontSize: 10, color: 'var(--tt-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'Manrope', sans-serif" }}>{member.role}</div>
          </div>
        </div>
      </td>
      {/* Stats */}
      <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--tt-text-primary)' }}>
        {member.tokens > 0 ? `${(member.tokens / 1e6).toFixed(1)}M` : '—'}
      </td>
      <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
        {member.sessions > 0 ? member.sessions.toLocaleString() : '—'}
      </td>
      <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
        {member.cost > 0 ? `$${member.cost.toFixed(0)}` : '—'}
      </td>
      <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
        <span style={{ color: member.successRate >= 90 ? 'var(--tt-accent)' : member.successRate >= 70 ? 'var(--tt-warning)' : member.successRate > 0 ? 'var(--tt-critical-text)' : 'var(--tt-text-muted)' }}>
          {member.successRate > 0 ? `${member.successRate.toFixed(1)}%` : '—'}
        </span>
      </td>
      <td style={{ padding: '10px 12px' }}>
        {member.trend.some(v => v > 0) ? (
          <SparkLine data={member.trend} color="var(--tt-accent)" height={24} />
        ) : (
          <span style={{ fontSize: 10, color: 'var(--tt-text-muted)', fontFamily: 'JetBrains Mono' }}>—</span>
        )}
      </td>
      <td style={{ padding: '10px 12px' }}>
        <StateChip state={isDisconnected ? member.status === 'disconnected' ? 'disconnected' : 'unknown' : 'healthy'} />
      </td>
    </tr>
  );
}

function Podium({ members }: { members: TeamMember[] }) {
  const top3 = members.slice(0, 3);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
      {/* 2nd */}
      {top3[1] && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(192, 192, 192, 0.1)', border: '2px solid #c0c0c080', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontFamily: 'JetBrains Mono', color: '#c0c0c0', fontWeight: 700 }}>{top3[1].avatar}</div>
          <span style={{ fontSize: 11, color: 'var(--tt-text-secondary)', fontFamily: "'Space Grotesk', sans-serif" }}>{top3[1].name}</span>
          <div style={{ width: 80, height: 60, background: 'rgba(192, 192, 192, 0.08)', border: '1px solid #c0c0c030', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#c0c0c0', fontWeight: 700 }}>#2</div>
        </div>
      )}
      {/* 1st */}
      {top3[0] && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255, 215, 0, 0.1)', border: '2px solid #ffd70080', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontFamily: 'JetBrains Mono', color: '#ffd700', fontWeight: 700 }}>{top3[0].avatar}</div>
          <span style={{ fontSize: 12, color: 'var(--tt-text-primary)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{top3[0].name}</span>
          <div style={{ width: 80, height: 80, background: 'rgba(255, 215, 0, 0.06)', border: '1px solid #ffd70030', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#ffd700', fontWeight: 700 }}>#1</div>
        </div>
      )}
      {/* 3rd */}
      {top3[2] && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(205, 127, 50, 0.1)', border: '2px solid #cd7f3280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontFamily: 'JetBrains Mono', color: '#cd7f32', fontWeight: 700 }}>{top3[2].avatar}</div>
          <span style={{ fontSize: 11, color: 'var(--tt-text-secondary)', fontFamily: "'Space Grotesk', sans-serif" }}>{top3[2].name}</span>
          <div style={{ width: 80, height: 44, background: 'rgba(205, 127, 50, 0.06)', border: '1px solid #cd7f3230', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#cd7f32', fontWeight: 700 }}>#3</div>
        </div>
      )}
    </div>
  );
}

export function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const thStyle: React.CSSProperties = {
    padding: '6px 12px',
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--tt-text-muted)',
    fontFamily: "'Manrope', sans-serif",
    textAlign: 'left',
    borderBottom: '1px solid var(--tt-border)',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1200 }}>
      <PageHeader title="Team" subtitle="Member performance and leaderboard" />

      {/* Podium */}
      <Podium members={mockTeamMembers.filter(m => m.status === 'active')} />

      {/* Disconnected notice */}
      {mockTeamMembers.some(m => m.status !== 'active') && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: 'var(--tt-unknown-bg)',
          border: '1px solid var(--tt-border)',
          borderRadius: 5,
          marginBottom: 16,
          fontSize: 11,
          color: 'var(--tt-text-muted)',
          fontFamily: "'Manrope', sans-serif",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--tt-unknown)', display: 'inline-block' }} />
          {mockTeamMembers.filter(m => m.status !== 'active').length} member(s) disconnected or unavailable — data not available for these users.
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="tt-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Rank', 'Member', 'Tokens', 'Sessions', 'Spend', 'Success Rate', 'Trend', 'Status'].map(h => (
                <th key={h} style={{ ...thStyle, textAlign: h === 'Rank' || h === 'Member' || h === 'Status' || h === 'Trend' ? 'left' : 'right' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockTeamMembers.map(m => (
              <MemberRow key={m.id} member={m} onSelect={setSelectedMember} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Member Detail Sheet */}
      <Sheet open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <SheetContent style={{ background: 'var(--tt-bg-secondary)', borderLeft: '1px solid var(--tt-border)', color: 'var(--tt-text-primary)' }}>
          {selectedMember && (
            <>
              <SheetHeader>
                <SheetTitle style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--tt-text-primary)' }}>
                  {selectedMember.name}
                </SheetTitle>
              </SheetHeader>
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--tt-accent-soft)', border: '1px solid var(--tt-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontFamily: 'JetBrains Mono', color: 'var(--tt-accent)', fontWeight: 700 }}>
                    {selectedMember.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{selectedMember.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--tt-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{selectedMember.role}</div>
                    <div style={{ marginTop: 4 }}><StateChip state="healthy" /></div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'Rank', value: `#${selectedMember.rank}` },
                    { label: 'Sessions', value: selectedMember.sessions.toLocaleString() },
                    { label: 'Tokens', value: `${(selectedMember.tokens / 1e6).toFixed(1)}M` },
                    { label: 'Spend', value: `$${selectedMember.cost.toFixed(0)}` },
                    { label: 'Success Rate', value: `${selectedMember.successRate.toFixed(1)}%` },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'var(--tt-bg)', border: '1px solid var(--tt-border)', borderRadius: 5, padding: '10px 12px' }}>
                      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tt-text-muted)', marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 16, color: 'var(--tt-accent)' }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tt-text-muted)', marginBottom: 8 }}>Session Trend</div>
                  <SparkLine data={selectedMember.trend} color="var(--tt-accent)" height={48} />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
